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

/**
 * Pour chaque chaîne, cherche 3 commentaires dans ses dernières vidéos.
 * Skip silencieusement les vidéos avec commentaires désactivés.
 */
async function getChannelReviews(uploadsPlaylistId: string, channelName: string): Promise<any[]> {
  const out: any[] = [];
  
  try {
    // Récupère les 15 dernières vidéos de la chaîne
    const pl = await yt(`playlistItems?part=snippet&maxResults=15&playlistId=${uploadsPlaylistId}&key=${KEY}`);
    const videoIds: string[] = (pl.items ?? []).map((v: any) => v.snippet?.resourceId?.videoId).filter(Boolean);
    
    for (const vid of videoIds) {
      if (out.length >= 3) break;
      
      try {
        // Récupère les commentaires top de cette vidéo
        const ct = await yt(`commentThreads?part=snippet&videoId=${vid}&order=relevance&maxResults=5&key=${KEY}`);
        
        // Récupère le titre de la vidéo pour l'affichage
        const v = await yt(`videos?part=snippet&ids=${vid}&key=${KEY}`);
        const vTitle = v.items?.[0]?.snippet?.title ?? '';
        
        for (const it of ct.items ?? []) {
          if (out.length >= 3) break;
          const s = it.snippet?.topLevelComment?.snippet;
          if (s && (s.textDisplay || '').trim().length > 10) {
            out.push({
              text: s.textDisplay.replace(/<[^>]*>/g, '').slice(0, 220),
              author: s.authorDisplayName ?? 'communauté',
              authorUrl: s.authorChannelUrl ?? '',
              likes: s.likeCount ?? 0,
              videoId: vid,
              videoTitle: vTitle,
              channel: channelName,
            });
          }
        }
      } catch (err: any) {
        // 403 commentsDisabled, 404, ou autre erreur → skip cette vidéo
        // On continue avec la vidéo suivante
        continue;
      }
    }
  } catch {
    // Erreur globale (playlist introuvable, etc.) → on retourne vide
  }
  
  return out;
}

export async function GET() {
  if (!KEY) return NextResponse.json(base);

  try {
    // 1. Chaînes + vidéos récentes (pour la section vidéos)
    const channels: any[] = [];
    const allVideos: any[] = [];
    const playlistIds: Array<{ id: string; name: string }> = [];

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

    // 2. Reviews : 3 commentaires par chaîne, en sautant les vidéos verrouillées
    const reviews: any[] = [];
    for (const pl of playlistIds) {
      const channelReviews = await getChannelReviews(pl.id, pl.name);
      reviews.push(...channelReviews);
    }

    const finalReviews = reviews.length >= 6 ? reviews : base.reviews;

    return NextResponse.json({
      live: true,
      channels,
      videos: videos.length ? videos : base.videos,
      reviews: finalReviews,
    });
  } catch {
    return NextResponse.json(base);
  }
}