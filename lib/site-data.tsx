"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { youtubeChannels, fallbackLatestVideos } from '@/data/viree';

export interface ChannelData { id: string; handle: string; name: string; url: string; positioning: string; description: string; audience: string; themes: string[]; accent: string; subscribers: number | null; avatar: string | null; }
export interface VideoData { videoId: string; title: string; description: string; thumb: string; publishedAt: string; channel: string; channelUrl: string; }
export interface SiteData { live: boolean; channels: ChannelData[]; videos: VideoData[]; reviews: ReviewData[]; }
export interface ReviewData {
  text: string;
  author: string;
  source: 'youtube' | 'facebook' | 'instagram' | 'tiktok'; // ⭐ Union type strict
  url: string;
  videoId: string;
  videoTitle: string;
  channel: string;
  likes: number;
}
const fallback: SiteData = {
  live: false,
  channels: youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null })),
  videos: fallbackLatestVideos.map((v) => ({ videoId: '', title: v.title, description: '', thumb: v.image, publishedAt: '', channel: v.tag, channelUrl: v.url })),
  reviews: [], // ← vide, les vraies reviews viennent du fetch API
};

const Ctx = createContext<SiteData>(fallback);
let cache: SiteData | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60_000; // ⭐ 5 minutes

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(cache ?? fallback);
  
  useEffect(() => {
    const isCacheFresh = cache && (Date.now() - cacheTime < CACHE_TTL);
    if (isCacheFresh) return;
    
    fetch('/api/youtube')
      .then((r) => r.json())
      .then((d) => {
        if (d?.channels) {
          cache = d as SiteData;
          cacheTime = Date.now();
          setData(cache);
        }
      })
      .catch(() => {});
  }, []);
  
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export const useSiteData = () => useContext(Ctx);