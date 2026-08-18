"use client";
import { useEffect, useState } from 'react';
import { brandData, navigation } from '@/data/viree';
import YouTubeDropdown from './YouTubeDropdown';
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-paper/90 shadow-[0_1px_0_rgba(22,41,74,0.1)] backdrop-blur-md' : ''}`}>
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-4 md:px-8">
<a href="#" className="font-display text-lg font-bold" onClick={() => setOpen(false)}>
  La Virée d’Hector
</a>                 <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((n) => <a key={n.href} href={n.href} className="text-[13px] font-semibold text-mist transition-colors hover:text-sunset">{n.label}</a>)}
<YouTubeDropdown variant="red" />
        </nav>
        <button className="label md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fermer' : 'Menu'}</button>
      </div>
      {open && (
        <div className="border-t border-ink/10 bg-paper px-5 pb-8 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navigation.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display text-2xl font-semibold">{n.label}</a>)}
          </nav>
        </div>
      )}
    </header>
  );
}