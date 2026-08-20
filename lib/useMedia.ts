// lib/useMedia.ts
"use client";
import { useEffect, useState, useSyncExternalStore } from 'react';

// ⭐ Store global avec subscription
type MediaStore = Record<string, Record<string, string>>;

const store: MediaStore = {};
const listeners = new Set<(key: string) => void>();

function subscribe(key: string, cb: (key: string) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(key: string): Record<string, string> {
  return store[key] ?? {};
}

function setImages(key: string, images: Record<string, string>) {
  store[key] = images;
  listeners.forEach((cb) => cb(key));
}

// ⭐ Cache des fetch en cours
const fetches = new Map<string, Promise<Record<string, string>>>();

async function fetchImages(key: string): Promise<Record<string, string>> {
  // Déjà dans le store ?
  if (store[key]) return store[key];
  
  // Fetch en cours ?
  if (fetches.has(key)) return fetches.get(key)!;

  const promise = fetch(`/api/media?key=${encodeURIComponent(key)}`)
    .then((r) => (r.ok ? r.json() : { images: {} }))
    .then((d) => {
      const imgs = (d && d.images && typeof d.images === 'object') ? d.images : {};
      setImages(key, imgs);
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

// ⭐ Hook principal avec subscription
export function useMediaImages(key: string): Record<string, string> {
  const [images, setImagesState] = useState<Record<string, string>>(
    () => getSnapshot(key)
  );

  useEffect(() => {
    // Initial fetch si pas déjà fait
    if (!store[key] && !fetches.has(key)) {
      fetchImages(key).then((imgs) => {
        setImagesState(imgs);
      });
    } else if (store[key]) {
      setImagesState(store[key]);
    }

    // Subscribe aux changements
    const unsub = subscribe(key, (changedKey) => {
      if (changedKey === key) {
        setImagesState(getSnapshot(key));
      }
    });

    return unsub;
  }, [key]);

  return images;
}

export function useMediaImage(key: string): string | null {
  const images = useMediaImages(key);
  // Pour une image unique, la clé est aussi le nom dans l'objet
  // Mais on peut aussi chercher par valeur dans l'objet
  const keys = Object.keys(images);
  if (keys.length === 0) return null;
  // Prend la première (et unique) valeur
  return images[keys[0]] ?? null;
}