// app/api/youtube/route.ts
import { NextResponse } from 'next/server';
import { youtubeChannels, fallbackLatestVideos, type YoutubeChannel } from '@/data/viree';
import { curatedReviews } from '@/data/reviews';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rate-limit-local';

// ⭐ Types YouTube API
interface YouTubePlaylistItem {
  snippet: {
    resourceId: { videoId: string };
    title: string;
    description: string;
    thumbnails?: {
      high?: { url: string };
      medium?: { url: string };
    };
    publishedAt: string;
  };
}

interface YouTubeVideo {
  snippet?: {
    title: string;
    thumbnails?: { medium?: { url: string } };
  };
  statistics?: {
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
  };
  contentDetails?: {
    relatedPlaylists?: { uploads: string };
  };
}

interface Review {
  text: string;
  author: string;
  source: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  url: string;
  videoId: string;
  videoTitle: string;
  channel: string;
  likes: number;
}

interface VideoOutput {
  videoId: string;
  title: string;
  description: string;
  thumb: string;
  publishedAt: string;
  channel: string;
  channelUrl: string;
}

// ⭐ Configuration YouTube centralisée (ajouts en gras)
const YT = {
  MAX_VIDEOS_PER_PLAYLIST: 30,
  SAMPLE_SIZE_FOR_REVIEWS: 6,
  MAX_COMMENTS_PER_VIDEO: 5,        // ⭐ AJOUTÉ
  MAX_VIDEOS_DISPLAY: 4,
  MAX_REVIEWS_PER_CHANNEL: 3,
  MAX_REVIEWS_TOTAL: 9,
  MAX_COMMENT_LENGTH: 220,
  MAX_AUTHOR_LENGTH: 100,
  MAX_VIDEO_TITLE_LENGTH: 200,
  MAX_VIDEO_DESCRIPTION_LENGTH: 150,
  MAX_LIKES_CAP: 999999,
  MIN_COMMENT_LENGTH: 10,
} as const;

export const revalidate = 3600;
const KEY = process.env.YOUTUBE_API_KEY;

const VALID_SOURCES = new Set(['youtube', 'facebook', 'instagram', 'tiktok']);

// ⭐ Schemas Zod
const HANDLE_SCHEMA = z.string()
  .regex(/^@[a-zA-Z0-9_-]{3,30}$/, 'Invalid YouTube handle')
  .max(31);

const PLAYLIST_SCHEMA = z.string()
  .regex(/^[a-zA-Z0-9_-]{10,50}$/, 'Invalid playlist ID');

const VIDEO_ID_SCHEMA = z.string()
  .regex(/^[a-zA-Z0-9_-]{11}$/, 'Invalid video ID');

// ⭐ Fonction yt sécurisée (clé jamais dans les logs)
const SAFE_ENDPOINT = /^[a-zA-Z]+$/;

const yt = async (endpointOrPath: string, params?: Record<string, string>) => {
  let fullPath: string;
  let urlToLog: string;

  if (params !== undefined) {
    if (!SAFE_ENDPOINT.test(endpointOrPath)) {
      console.error('[youtube] Invalid endpoint:', endpointOrPath);
      throw new Error('Invalid YouTube endpoint');
    }
    const queryString = new URLSearchParams(params).toString();
    fullPath = `${endpointOrPath}?${queryString}&key=${KEY}`;
    urlToLog = `https://www.googleapis.com/youtube/v3/${endpointOrPath}?${queryString}&key=***`;
  } else {
    fullPath = endpointOrPath;
    urlToLog = endpointOrPath.replace(/key=[^&]+/, 'key=***');
  }

  try {
    const r = await fetch(`https://www.googleapis.com/youtube/v3/${fullPath}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });

    if (!r.ok) {
      console.error(`[youtube] API error: ${r.status}`, { endpoint: urlToLog });
      throw new Error(`YT ${r.status}`);
    }
    return r.json();
  } catch (err) {
    console.error('[youtube] Fetch failed', { endpoint: urlToLog });
    throw err;
  }
};

const base = {
  live: false,
  channels: youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null })),
  videos: fallbackLatestVideos.map((v) => ({
    videoId: '',
    title: v.title,
    description: '',
    thumb: v.image,
    publishedAt: '',
    channel: v.tag,
    channelUrl: v.url,
  })),
  reviews: curatedReviews.filter((r) => VALID_SOURCES.has(r.source)),
};

// ⭐ Recherche intelligente de reviews
async function getChannelReviewsSmart(
  uploadsPlaylistId: string,
  channelName: string,
  limit = YT.MAX_REVIEWS_PER_CHANNEL
): Promise<Review[]> {
  const out: Review[] = [];

  try {
    const pl = await yt(
      `playlistItems?part=snippet&maxResults=${YT.MAX_VIDEOS_PER_PLAYLIST}&playlistId=${uploadsPlaylistId}&key=${KEY}`
    );

    const videoIds: string[] = (pl.items ?? [])
      .map((v: any) => v.snippet?.resourceId?.videoId)
      .filter(Boolean);

    if (!videoIds.length) return out;

    const shuffled = videoIds
      .sort(() => Math.random() - 0.5)
      .slice(0, YT.SAMPLE_SIZE_FOR_REVIEWS);

    for (const vid of shuffled) {
      if (out.length >= limit) break;

      try {
        const ct = await yt(
          `commentThreads?part=snippet&videoId=${vid}&order=relevance&maxResults=${YT.MAX_COMMENTS_PER_VIDEO}&key=${KEY}`
        );

        if (!ct.items?.length) continue;

        const v = await yt(`videos?part=snippet&ids=${vid}&key=${KEY}`);
        const vTitle = v.items?.[0]?.snippet?.title ?? '';

        for (const it of ct.items ?? []) {
          if (out.length >= limit) break;
          const s = it.snippet?.topLevelComment?.snippet;
          if (s && (s.textDisplay || '').trim().length > YT.MIN_COMMENT_LENGTH) {
            out.push({
              text: s.textDisplay
                .replace(/<[^>]*>/g, '')
                .replace(/[<>]/g, '')
                .slice(0, YT.MAX_COMMENT_LENGTH),
              author: (s.authorDisplayName ?? 'communauté').slice(0, YT.MAX_AUTHOR_LENGTH),
              source: 'youtube' as const,
              url: `https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`,
              videoId: vid,
              videoTitle: vTitle.slice(0, YT.MAX_VIDEO_TITLE_LENGTH),
              channel: channelName,
              likes: Math.min(s.likeCount ?? 0, YT.MAX_LIKES_CAP),
            });
          }
        }
      } catch {
        continue;
      }
    }
  } catch {
    // Erreur globale silencieusement ignorée
  }

  return out;
}

function isValidReview(r: unknown): r is Review {
  if (!r || typeof r !== 'object') return false;
  const obj = r as Record<string, unknown>;
  return (
    typeof obj.text === 'string' &&
    obj.text.trim().length > 0 &&
    typeof obj.source === 'string' &&
    VALID_SOURCES.has(obj.source)
  );
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const blocked = withRateLimit('youtube', ip);
  if (blocked) return blocked;

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!KEY) {
    const fallbackReviews = shuffle(base.reviews.filter(isValidReview))
      .slice(0, YT.MAX_REVIEWS_TOTAL);
    return NextResponse.json({ ...base, reviews: fallbackReviews });
  }

  try {
    const channels: Array<YoutubeChannel & { subscribers: number | null; avatar: string | null }> = [];
    const allVideos: VideoOutput[] = [];
    const playlistIds: Array<{ id: string; name: string }> = [];

    for (const c of youtubeChannels) {
      const ch = await yt(
        `channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(c.handle)}&key=${KEY}`
      );
      const item = ch.items?.[0];
      if (!item) {
        channels.push({ ...c, subscribers: null, avatar: null });
        continue;
      }

      channels.push({
        ...c,
        subscribers: item.statistics?.hiddenSubscriberCount
          ? null
          : Number(item.statistics?.subscriberCount) || null,
        avatar: item.snippet?.thumbnails?.medium?.url ?? null,
      });

      const uploads = item.contentDetails?.relatedPlaylists?.uploads;
      if (uploads) {
        playlistIds.push({ id: uploads, name: c.name });

        const pl = await yt(
          `playlistItems?part=snippet&maxResults=${YT.MAX_VIDEOS_DISPLAY}&playlistId=${uploads}&key=${KEY}`
        );
        for (const v of pl.items ?? []) {
          allVideos.push({
            videoId: v.snippet.resourceId.videoId,
            title: v.snippet.title,
            description: (v.snippet.description || '')
              .replace(/\s+/g, ' ')
              .slice(0, YT.MAX_VIDEO_DESCRIPTION_LENGTH),
            thumb:
              v.snippet.thumbnails?.high?.url ??
              v.snippet.thumbnails?.medium?.url ??
              '',
            publishedAt: v.snippet.publishedAt,
            channel: c.name,
            channelUrl: c.url,
          });
        }
      }
    }

    allVideos.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    const videos = allVideos.slice(0, YT.MAX_VIDEOS_DISPLAY);

    const ytReviews: Review[] = [];
    for (const pl of playlistIds) {
      const found = await getChannelReviewsSmart(pl.id, pl.name);
      ytReviews.push(...found);
    }

    const allReviews = [...ytReviews, ...curatedReviews].filter(isValidReview);
    const reviews = shuffle(allReviews).slice(0, YT.MAX_REVIEWS_TOTAL);

    return NextResponse.json({
      live: true,
      channels,
      videos: videos.length ? videos : base.videos,
      reviews,
      reviewsCount: reviews.length,
    });
  } catch {
    const fallbackReviews = shuffle(base.reviews.filter(isValidReview))
      .slice(0, YT.MAX_REVIEWS_TOTAL);
    return NextResponse.json({ ...base, reviews: fallbackReviews });
  }
}