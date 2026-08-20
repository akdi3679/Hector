// lib/useMedia.ts
"use client";
import { useEffect, useState } from 'react';

const cache = new Map<string, Record<string, string>>();

export function useMediaImages(key: string): Record<string, string> {
  const [images, setImages] = useState<Record<string, string>>(() => cache.get(key) ?? {});

  useEffect(() => {
    if (cache.has(key)) {
      setImages(cache.get(key) ?? {});
      return;
    }

    let cancelled = false;

    fetch(`/api/media?key=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : { images: {} }))
      .then((d) => {
        if (cancelled) return;
        const imgs = (d && d.images && typeof d.images === 'object') ? d.images : {};
        cache.set(key, imgs);
        setImages(imgs);
      })
      .catch((err) => {
        console.error(`[useMedia] Failed for key "${key}":`, err);
        if (!cancelled) {
          cache.set(key, {});
          setImages({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return images;
}

export function useMediaImage(key: string): string | null {
  const images = useMediaImages(key);
  return images[key] ?? null;
}