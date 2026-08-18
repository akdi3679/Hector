import { NextResponse } from 'next/server';
import { youtubeChannels, fallbackLatestVideos } from '@/data/viree';
import { curatedReviews } from '@/data/reviews';
export const revalidate = 120; // Cache 2 minutes → le shuffle change souvent
const KEY = process.env.YOUTUBE_API_KEY;

// Seules ces sources sont valides
const VALID_SOURCES = new Set(['youtube', 'facebook', 'instagram', 'tiktok']);

const yt = async (p: string) => {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${p}`, { next: { revalidate: 3600 } });
  if (!r.ok) throw new Error(`YT ${r.status}`);
  return r.json();
};

const base = {
  live: false,
  channels: youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null })),
  videos: fallbackLatestVideos.map((v) => ({ videoId: '', title: v.title, description: '', thumb: v.image, publishedAt: '', channel: v.tag, channelUrl: v.url })),
  reviews: curatedReviews.filter((r) => VALID_SOURCES.has(r.source)),
};

/**
 * Recherche intelligente : test jusqu'à 12 vidéos choisies au hasard dans la liste des uploads.
 * Skip les vidéos avec commentaires désactivés. Arrête dès qu'on a 3 reviews.
 */
async function getChannelReviewsSmart(uploadsPlaylistId: string, channelName: string, limit = 3): Promise<any[]> {
  const out: any[] = [];

  try {
    // 1. Récupère les IDs de 30 vidéos (léger, 1 seul appel)
    const pl = await yt(`playlistItems?part=snippet&maxResults=30&playlistId=${uploadsPlaylistId}&key=${KEY}`);
    const videoIds: string[] = (pl.items ?? []).map((v: any) => v.snippet?.resourceId?.videoId).filter(Boolean);
    if (!videoIds.length) return out;

    // 2. Mélange aléatoirement et prend 12 max
    const shuffled = videoIds.sort(() => Math.random() - 0.5).slice(0, 12);

    // 3. Test chaque vidéo jusqu'à avoir assez de commentaires
    for (const vid of shuffled) {
      if (out.length >= limit) break;

      try {
        const ct = await yt(`commentThreads?part=snippet&videoId=${vid}&order=relevance&maxResults=5&key=${KEY}`);
        if (!ct.items?.length) continue;

        const v = await yt(`videos?part=snippet&ids=${vid}&key=${KEY}`);
        const vTitle = v.items?.[0]?.snippet?.title ?? '';

        for (const it of ct.items ?? []) {
          if (out.length >= limit) break;
          const s = it.snippet?.topLevelComment?.snippet;
          if (s && (s.textDisplay || '').trim().length > 10) {
            out.push({
              text: s.textDisplay.replace(/<[^>]*>/g, '').slice(0, 220),
              author: s.authorDisplayName ?? 'communauté',
              source: 'youtube',
              url: `https://www.youtube.com/watch?v=${vid}`,
              videoId: vid,
              videoTitle: vTitle,
              channel: channelName,
              likes: s.likeCount ?? 0,
            });
          }
        }
      } catch {
        // 403 commentaires désactivés → skip cette vidéo
        continue;
      }
    }
  } catch {
    // Erreur globale → vide
  }

  return out;
}

/**
 * Vérifie qu'une review a une source valide
 */
function isValidReview(r: any): boolean {
  return (
    r &&
    typeof r.text === 'string' &&
    r.text.trim().length > 0 &&
    VALID_SOURCES.has(r.source)
  );
}

/**
 * Mélange un tableau aléatoirement
 */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET() {
  if (!KEY) {
    const fallbackReviews = shuffle(base.reviews.filter(isValidReview)).slice(0, 9);
    return NextResponse.json({ ...base, reviews: fallbackReviews });
  }

  try {
    // 1. Chaînes + vidéos récentes
    const channels: any[] = [];
    const allVideos: any[] = [];
    const playlistIds: Array<{ id: string; name: string }> = [];

    for (const c of youtubeChannels) {
      const ch = await yt(`channels?part=snippet,statistics,contentDetails&forHandle=${encodeURIComponent(c.handle)}&key=${KEY}`);
      const item = ch.items?.[0];
      if (!item) {
        channels.push({ ...c, subscribers: null, avatar: null });
        continue;
      }

      channels.push({
        ...c,
        subscribers: item.statistics?.hiddenSubscriberCount ? null : Number(item.statistics?.subscriberCount) || null,
        avatar: item.snippet?.thumbnails?.medium?.url ?? null,
      });

      const uploads = item.contentDetails?.relatedPlaylists?.uploads;
      if (uploads) {
        playlistIds.push({ id: uploads, name: c.name });

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

    // 2. Reviews YouTube (recherche intelligente)
    const ytReviews: any[] = [];
    for (const pl of playlistIds) {
      const found = await getChannelReviewsSmart(pl.id, pl.name, 3);
      ytReviews.push(...found);
    }

    // 3. Fusionne YouTube + curated, filtre les sources invalides, mélange, max 9
    const allReviews = [...ytReviews, ...curatedReviews].filter(isValidReview);
    const reviews = shuffle(allReviews).slice(0, 9);

       
    return NextResponse.json({
      live: true,
      channels,
      videos: videos.length ? videos : base.videos,
      reviews, // Seulement 9 — les autres ne quittent jamais le serveur
      reviewsCount: reviews.length,
    });
  } catch {
    const fallbackReviews = shuffle(base.reviews.filter(isValidReview)).slice(0, 9);
    return NextResponse.json({ ...base, reviews: fallbackReviews });
  }

}