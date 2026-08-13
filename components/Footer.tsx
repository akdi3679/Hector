"use client";
import { useState } from 'react';
import { brandData, navigation } from '@/data/viree';

export default function Footer() {
  const [on, setOn] = useState(false);

  // clique n'importe où dans le footer = phares, sauf sur les liens
  const toggle = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button, input')) return;
    setOn(!on);
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-paper" onClick={toggle}>
      {/* Hector fondu dans le fond du footer */}
      <div className="absolute inset-0" aria-hidden="true">
        <img src="/images/hector-off.jpg" alt="" className="h-full w-full object-cover object-center" />
        <img
          src="/images/hector-on.jpg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* halo des phares quand allumés */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'radial-gradient(ellipse 45% 30% at 50% 55%, rgba(242,179,61,0.2), transparent 70%)' }}
        />
        {/* dégradé sombre, transparent là où est le camion */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(22,41,74,0.97) 0%, rgba(22,41,74,0.5) 45%, rgba(22,41,74,0.6) 65%, rgba(22,41,74,0.97) 100%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 pb-10 pt-24 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-bold">La Virée d’Hector</p>
          <p className="hand mt-2 text-2xl text-sun">{brandData.tagline}</p>
          <p className="mt-3 max-w-xs text-sm text-paper/70">{brandData.couple} · {brandData.truck}.</p>
        </div>
        <nav className="flex flex-col items-start gap-3">
          {navigation.map((n) => <a key={n.href} href={n.href} className="w-fit text-sm font-semibold text-paper/75 hover:text-sun">{n.label}</a>)}
        </nav>
        <div className="flex flex-col items-start gap-3 text-sm font-semibold">
          <a href={brandData.youtube.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">YouTube — 3 chaînes</a>
          <a href={brandData.tiktok.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">TikTok {brandData.tiktok.handle}</a>
          <a href={brandData.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">Instagram {brandData.instagram.handle}</a>
          <a href={brandData.facebook.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">Facebook</a>
        </div>
      </div>

      <p className="hand relative z-10 pb-4 text-center text-2xl text-paper/80">
        {on ? 'cliquez pour éteindre Hector' : 'cliquez pour allumer Hector'}
      </p>

      <p className="relative z-10 border-t border-paper/10 py-6 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} La Virée d’Hector · <a href="/mentions-legales" className="hover:text-sun">Mentions légales</a>
      </p>
    </footer>
  );
}