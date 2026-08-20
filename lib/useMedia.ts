// lib/useMedia.ts
"use client";
import { useEffect, useState } from "react";

type MediaStore = Record<string, Record<string, string>>;

const store: MediaStore = {};
const listeners = new Set<(key: string) => void>();

function subscribe(key: string, cb: (key: string) => void): () => void {
  listeners.add(cb);
  // ⭐ Retourne une fonction qui ne retourne rien (void)
  return () => {
    listeners.delete(cb);
    // Pas de return ici = void
  };
}

function getSnapshot(key: string): Record<string, string> {
  return store[key] ?? {};
}

function setImages(key: string, images: Record<string, string>) {
  store[key] = images;
  listeners.forEach((cb) => cb(key));
}

const fetches = new Map<string, Promise<Record<string, string>>>();
const emptyKeys = new Set<string>(); // ⭐ Cache des clés sans images

async function fetchImages(key: string): Promise<Record<string, string>> {
  if (store[key]) return store[key];
  if (emptyKeys.has(key)) return {}; // ⭐ Clé déjà connue comme vide
  if (fetches.has(key)) return fetches.get(key)!;
  
  const promise = fetch(`/api/media?key=${encodeURIComponent(key)}`)
    .then((r) => (r.ok ? r.json() : { images: {} }))
        .then((d) => {
      const imgs = (d && d.images && typeof d.images === "object") ? d.images : {};
      
      if (Object.keys(imgs).length === 0) {
        // ⭐ Cache la clé vide pour 60s (évite refetch)
        emptyKeys.add(key);
        setTimeout(() => emptyKeys.delete(key), 60_000);
      } else {
        setImages(key, imgs);
      }
      
      fetches.delete(key);
      return imgs;
    })
    .catch((err) => {
      console.error(`[useMedia] Failed for key "${key}":`, err);
      fetches.delete(key);
      return {};
    });

  fetches.set(key, promise);
  return promise;
}

export function useMediaImages(key: string): Record<string, string> {
  const [images, setImagesState] = useState<Record<string, string>>(
    () => getSnapshot(key)
  );

  useEffect(() => {
    if (!store[key] && !fetches.has(key)) {
      fetchImages(key).then((imgs) => setImagesState(imgs));
    } else if (store[key]) {
      setImagesState(store[key]);
    }

    const unsubscribe = subscribe(key, (changedKey) => {
      if (changedKey === key) setImagesState(getSnapshot(key));
    });

    // ⭐ Cleanup qui ne retourne rien (void)
    return () => {
      unsubscribe();
      // Pas de return ici
    };
  }, [key]);

  return images;
}

export function useMediaImage(key: string): string | null {
  const images = useMediaImages(key);
  const keys = Object.keys(images);
  if (keys.length === 0) return null;
  return images[keys[0]] ?? null;
}