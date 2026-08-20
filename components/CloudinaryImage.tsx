// components/CloudinaryImage.tsx
"use client";
import { useState, useCallback, useMemo } from "react";
import { RefreshCw, ImageOff } from "lucide-react";
import { cdn } from "@/lib/cloudinary-config";

interface Props {
  publicId: string;
  alt: string;
  w?: number;
  h?: number;
  ar?: string;
  crop?: "fill" | "limit" | "thumb" | "scale";
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty" | "gradient";
}

export default function CloudinaryImage({
  publicId,
  alt,
  w = 1200,
  h,
  ar,
  crop = "fill",
  className = "",
  priority = false,
  placeholder = "gradient",
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0); // ⭐ Pour forcer le rechargement

  const src = cdn(publicId, { w, h, ar, crop });
// ⭐ Memoize la concaténation pour éviter les recalculs
const srcWithCacheBust = useMemo(
  () => `${src}${src.includes("?") ? "&" : "?"}v=${retryKey}`,
  [src, retryKey]
);
  const handleRetry = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFailed(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ⭐ Placeholder pendant le chargement */}
      {!loaded && !failed && (
        <div
          className={`absolute inset-0 ${
            placeholder === "gradient"
              ? "bg-gradient-to-br from-muted to-muted/50 animate-pulse"
              : placeholder === "blur"
              ? "bg-muted"
              : "bg-transparent"
          }`}
        />
      )}

      {/* ⭐ État échec : bouton Réessayer */}
      {failed && (
        <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center gap-3 p-4">
          <ImageOff className="h-8 w-8 text-foreground/40" />
          <p className="text-xs text-foreground/60 text-center">
            Image non disponible
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent transition-colors"
            aria-label="Réessayer de charger l'image"
          >
            <RefreshCw size={14} />
            Réessayer
          </button>
        </div>
      )}

      {/* ⭐ Image réelle (cachée si échec) */}
      {!failed && (
        <img
          key={retryKey} // ⭐ Force le re-mount au retry
          src={srcWithCacheBust}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}