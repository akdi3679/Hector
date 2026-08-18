export interface LiveVideo {
  videoId: string;
  title: string;
  description: string;
  thumb: string;
  publishedAt: string;
  channel: string;
  channelUrl: string;
}

export interface LiveReview {
  text: string;
  author: string;
  source: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  url: string;
  videoId: string;
  videoTitle: string;
  channel: string;
  likes: number;
}

export interface LiveChannel {
  id: string;
  handle: string;
  name: string;
  url: string;
  positioning: string;
  description: string;
  audience: string;
  themes: string[];
  accent: 'red' | 'sun' | 'sky';
  subscribers: number | null;
  avatar: string | null;
}