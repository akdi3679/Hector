"use client";
import { useEffect, useState } from 'react';

export default function RoadProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      <div
        className="h-full bg-sun"
        style={{ width: `${p * 100}%`, backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 10px, rgba(22,41,74,0.35) 10px 14px)' }}
      />
    </div>
  );
}