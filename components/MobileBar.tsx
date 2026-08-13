"use client";
import { useEffect, useState } from 'react';
import { brandData } from '@/data/viree';

export default function MobileBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-md transition-transform duration-500 md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex gap-3 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a href={brandData.youtube.url} target="_blank" rel="noopener noreferrer" className="btn btn-red flex-1">YouTube</a>
        <a href="#marques" className="btn btn-ink flex-1">Marques</a>
      </div>
    </div>
  );
}