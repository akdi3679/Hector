// app/rate-limited/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';
import { rateLimitData } from '@/data/rate-limit';

export default function RateLimitedPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const { durationMs, localStorageKey } = rateLimitData.config;
    
    // ⭐ Stocke le timestamp au premier accès
    let startTime = localStorage.getItem(localStorageKey);
    if (!startTime) {
      startTime = String(Date.now());
      localStorage.setItem(localStorageKey, startTime);
    }

    const updateCountdown = () => {
      const elapsed = Date.now() - parseInt(startTime!, 10);
      const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        localStorage.removeItem(localStorageKey);
        router.replace('/');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = minutes > 0
    ? `${minutes}m ${seconds.toString().padStart(2, '0')}s`
    : `${seconds}s`;

  const handleRetry = () => {
    if (secondsLeft > 0) return;
    localStorage.removeItem(rateLimitData.config.localStorageKey);
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-5 py-10">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full bg-sun/20">
          <ShieldAlert className="h-12 w-12 text-sun" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
          {rateLimitData.title}
        </h1>

        <p className="hand text-2xl text-sunset mb-6">
          {rateLimitData.subtitle}
        </p>

        <p className="text-ink/70 leading-relaxed mb-8">
          {rateLimitData.description}
        </p>

        <div className="mb-8">
          <div className="inline-block px-6 py-4 bg-ink text-paper rounded-2xl">
            <p className="font-display text-3xl font-bold text-sun tabular-nums">
              {formatted}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleRetry}
            disabled={secondsLeft > 0}
            className="btn btn-ink flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={secondsLeft <= 0 ? 'animate-spin' : ''} />
            {secondsLeft > 0 ? rateLimitData.retryButtonDisabled : rateLimitData.retryButton}
          </button>

          <a href="/" className="btn btn-ghost flex items-center justify-center gap-2">
            <Home size={16} />
            {rateLimitData.homeButton}
          </a>
        </div>

        <p className="mt-8 text-xs text-ink/40">
          {rateLimitData.contactText}{' '}
          <a href={`mailto:${rateLimitData.contactEmail}`} className="text-sunset hover:underline">
            {rateLimitData.contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}