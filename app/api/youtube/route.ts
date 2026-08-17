import { NextResponse } from 'next/server';
import { youtubeChannels, reviews as staticReviews } from '@/data/viree';

export const revalidate = 3600; // cache 1h

const KEY = process.env.YOUTUBE_API_KEY;
const REVIEW_VIDEO_ID = process.env.YOUTUBE_REVIEW_VIDEO_ID;

async function yt(path: string) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube ${res.status}`);
  return res.json();
}

const fallback = {
  live: false,
  channels: youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null, latest: [] })),
  reviews: staticReviews,
};

export async function GET() {
  if (!KEY) return NextResponse.json(fallback);
  try {
    const channels = await Promise.all(
      youtubeChannels.map(async (c) => {
        const ch = await yt(`channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(c.handle)}&key=${KEY}`);
        const item = ch.items?.[0];
        let latest: { title: string; videoId: string; thumb: string; publishedAt: string }[] = [];
        const uploads = item?.contentDetails?.relatedPlaylists?.uploads;
        if (uploads) {
          const pl = await yt(`playlistItems?part=snippet&maxResults=3&playlistId=${uploads}&key=${KEY}`);
          latest = (pl.items ?? []).map((v: any) => ({
            title: v.snippet.title,
            videoId: v.snippet.resourceId.videoId,
            thumb: v.snippet.thumbnails?.medium?.url ?? '',
            publishedAt: v.snippet.publishedAt,
          }));
        }
        return {
          ...c,
          subscribers: item?.statistics?.hiddenSubscriberCount ? null : Number(item?.statistics?.subscriberCount ?? 0) || null,
          avatar: item?.snippet?.thumbnails?.medium?.url ?? null,
          latest,
        };
      })
    );

    let reviews = staticReviews;
    if (REVIEW_VIDEO_ID) {
      const ct = await yt(`commentThreads?part=snippet&videoId=${REVIEW_VIDEO_ID}&order=relevance&maxResults=4&key=${KEY}`);
      const live = (ct.items ?? [])
        .map((i: any) => ({
          text: i.snippet?.topLevelComment?.snippet?.textDisplay?.replace(/<[^>]*>/g, '').slice(0, 180),
          from: i.snippet?.topLevelComment?.snippet?.authorDisplayName ?? 'communauté',
        }))
        .filter((r: any) => r.text);
      if (live.length) reviews = live;
    }

    return NextResponse.json({ live: true, channels, reviews });
  } catch {
    return NextResponse.json(fallback);
  }
}