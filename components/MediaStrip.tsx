"use client";
import { useMemo } from "react";
import { useMediaImages } from "@/lib/useMedia";

interface Item {
  id: string;
  url: string;
  type: "image" | "gif" | "video";
}

interface Props {
  /** Clé sémantique (galerie ou moments) */
  mediaKey: "galerie" | "moments";
  tall?: boolean;
}

export default function MediaStrip({ mediaKey, tall = false }: Props) {
  const rawImages = useMediaImages(mediaKey);

  // ⭐ Transforme en Items + détecte le type
  const items: Item[] = useMemo(() => {
    return Object.entries(rawImages).map(([name, url]) => {
      const lowerName = name.toLowerCase();
      let type: "image" | "gif" | "video" = "image";
      if (lowerName.endsWith(".gif") || lowerName.includes("gif")) type = "gif";
      else if (lowerName.endsWith(".mp4") || lowerName.includes("video")) type = "video";
      return { id: name, url, type };
    });
  }, [rawImages]);

  const h = tall ? "h-[420px]" : "h-[320px]";
  const isEmpty = items.length === 0;

  return (
    <div>
      {isEmpty ? (
        // ⭐ Placeholder pendant le chargement
        <div className="moments-strip flex snap-x snap-mandatory items-center gap-6 overflow-x-auto pl-5 pr-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`polaroid shrink-0 snap-center ${i % 2 ? "rotate-1" : "-rotate-1"} ${
                tall ? "w-[300px] md:w-[340px]" : "w-[260px] md:w-[320px]"
              }`}
            >
              <div className={`card-img w-full overflow-hidden ${h} bg-gradient-to-br from-ink/10 to-ink/5 animate-pulse`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="moments-strip flex snap-x snap-mandatory items-center gap-6 overflow-x-auto pl-5 pr-5">
          {items.map((m, i) => (
            <div
              key={m.id}
              className={`polaroid shrink-0 snap-center ${i % 2 ? "rotate-1" : "-rotate-1"} ${
                tall ? "w-[300px] md:w-[340px]" : "w-[260px] md:w-[320px]"
              }`}
            >
              <div className={`card-img w-full overflow-hidden ${h}`}>
                {m.type === "video" ? (
                  <video
                    src={m.url}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={m.url}
                    alt={`${m.type === "gif" ? "GIF" : "Photo"} — La Virée d'Hector`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="hand mt-2 text-center text-2xl text-mist">faites défiler →</p>
    </div>
  );
}