import { NextResponse } from 'next/server';
import { youtubeChannels, fallbackLatestVideos, reviews as staticReviews } from '@/data/viree';

export const revalidate = 3600;
const KEY = process.env.YOUTUBE_API_KEY;

const yt = async (p: string) => {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${p}`, { next: { revalidate: 3600 } });
  if (!r.ok) throw new Error(`YT ${r.status}`);
  return r.json();
};

const base = {
  live: false,
  channels: youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null })),
  videos: fallbackLatestVideos.map((v) => ({ videoId: '', title: v.title, description: '', thumb: v.image, publishedAt: '', channel: v.tag, channelUrl: v.url })),
  reviews: staticReviews.map((r) => ({ text: r.text, author: r.from, authorUrl: '', likes: 0, videoId: '', videoTitle: '' })),
};

export async function GET() {
  if (!KEY) return NextResponse.json(base);
  try {
    const channels: any[] = [];
    const allVideos: any[] = [];

    for (const c of youtubeChannels) {
      const ch = await yt(`channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(c.handle)}&key=${KEY}`);
      const item = ch.items?.[0];
      if (!item) { channels.push({ ...c, subscribers: null, avatar: null }); continue; }
      channels.push({
        ...c,
        subscribers: item.statistics?.hiddenSubscriberCount ? null : Number(item.statistics?.subscriberCount) || null,
        avatar: item.snippet?.thumbnails?.medium?.url ?? null,
      });
      const uploads = item.contentDetails?.relatedPlaylists?.uploads;
      if (uploads) {
        const pl = await yt(`playlistItems?part=snippet&maxResults=4&playlistId=${uploads}&key=${KEY}`);
        for (const v of pl.items ?? []) allVideos.push({
          videoId: v.snippet.resourceId.videoId,
          title: v.snippet.title,
          description: (v.snippet.description || '').replace(/\s+/g, ' ').slice(0, 150),
          thumb: v.snippet.thumbnails?.high?.url ?? v.snippet.thumbnails?.medium?.url ?? '',
          publishedAt: v.snippet.publishedAt,
          channel: c.name,
          channelUrl: c.url,
        });
      }
    }

    allVideos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    const videos = allVideos.slice(0, 4);

    // Real reviews: top comments of the 2 latest videos
    let reviews = base.reviews;
    const live: any[] = [];
    for (const v of allVideos.slice(0, 2)) {
      const ct = await yt(`commentThreads?part=snippet&videoId=${v.videoId}&order=relevance&maxResults=2&key=${KEY}`);
      for (const it of ct.items ?? []) {
        const s = it.snippet?.topLevelComment?.snippet;
        if (s) live.push({
          text: (s.textDisplay || '').replace(/<[^>]*>/g, '').slice(0, 180),
          author: s.authorDisplayName ?? 'communauté',
          authorUrl: s.authorChannelUrl ?? '',
          likes: s.likeCount ?? 0,
          videoId: v.videoId,
          videoTitle: v.title,
        });
      }
    }
    if (live.length) reviews = live;

    return NextResponse.json({ live: true, channels, videos: videos.length ? videos : base.videos, reviews });
  } catch {
    return NextResponse.json(base);
  }
}