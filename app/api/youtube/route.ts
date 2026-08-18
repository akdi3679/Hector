import { NextResponse } from 'next/server';
import { youtubeChannels, fallbackLatestVideos, reviews as staticReviews } from '@/data/viree';

export const revalidate = 3600;
const KEY = process.env.YOUTUBE_API_KEY;

const yt = async (p: string) => {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${p}`, { next: { revalidate: 3600 } });
  if (!r.ok) {
    const err = await r.text().catch(() => 'unknown');
    console.error(`YouTube API ${r.status}:`, err);
    throw new Error(`YT ${r.status}`);
  }
  return r.json();
};

const base = {
  live: false,
  channels: youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null })),
  videos: fallbackLatestVideos.map((v) => ({ videoId: '', title: v.title, description: '', thumb: v.image, publishedAt: '', channel: v.tag, channelUrl: v.url })),
  reviews: staticReviews.map((r) => ({ text: r.text, author: r.from, authorUrl: '', likes: 0, videoId: '', videoTitle: '' })),
};

export async function GET() {
  console.log('[YouTube API] Starting, key present:', !!KEY);
  
  if (!KEY) {
    console.log('[YouTube API] No key, returning fallback');
    return NextResponse.json(base);
  }

  try {
    const channels: any[] = [];
    const allVideos: any[] = [];

    for (const c of youtubeChannels) {
      console.log(`[YouTube API] Fetching channel: ${c.handle}`);
      const ch = await yt(`channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(c.handle)}&key=${KEY}`);
      const item = ch.items?.[0];
      
      if (!item) {
        console.log(`[YouTube API] Channel not found: ${c.handle}`);
        channels.push({ ...c, subscribers: null, avatar: null });
        continue;
      }
      
      console.log(`[YouTube API] Found: ${item.snippet.title}, subs: ${item.statistics?.subscriberCount}`);
      channels.push({
        ...c,
        subscribers: item.statistics?.hiddenSubscriberCount ? null : Number(item.statistics?.subscriberCount) || null,
        avatar: item.snippet?.thumbnails?.medium?.url ?? null,
      });
      
      const uploads = item.contentDetails?.relatedPlaylists?.uploads;
      if (uploads) {
        const pl = await yt(`playlistItems?part=snippet&maxResults=4&playlistId=${uploads}&key=${KEY}`);
        for (const v of pl.items ?? []) {
          allVideos.push({
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
    }

    allVideos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    const videos = allVideos.slice(0, 4);

    let reviews = base.reviews;
    const live: any[] = [];
    for (const v of allVideos.slice(0, 2)) {
      try {
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
      } catch (err) {
        console.error(`[YouTube API] Comments failed for ${v.videoId}:`, err);
      }
    }
    if (live.length) reviews = live;

    console.log('[YouTube API] Success, returning live data');
    return NextResponse.json({ live: true, channels, videos: videos.length ? videos : base.videos, reviews });
  } catch (err) {
    console.error('[YouTube API] Error:', err);
    return NextResponse.json(base);
  }
}