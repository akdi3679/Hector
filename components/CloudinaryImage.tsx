// components/CloudinaryImage.tsx
"use client";
import { useState } from 'react';
import { cdn } from '@/lib/cloudinary-config';

interface Props {
  publicId: string;
  alt: string;
  w?: number;
  h?: number;
  ar?: string;
  crop?: 'fill' | 'limit' | 'thumb' | 'scale';
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | 'gradient';
}

export default function CloudinaryImage({
  publicId,
  alt,
  w = 1200,
  h,
  ar,
  crop = 'fill',
  className = '',
  priority = false,
  placeholder = 'gradient',
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const src = cdn(publicId, { w, h, ar, crop });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!loaded && !error && (
        <div
          className={`absolute inset-0 ${
            placeholder === 'gradient'
              ? 'bg-gradient-to-br from-muted to-muted/50 animate-pulse'
              : placeholder === 'blur'
              ? 'bg-muted'
              : 'bg-transparent'
          }`}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image non disponible</span>
        </div>
      )}

      {/* Image réelle */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}