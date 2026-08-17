"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { youtubeChannels } from '@/data/viree';

interface Live {
  name: string;
  url: string;
  handle: string;
  positioning: string;
  subscribers: number | null;
  avatar: string | null;
}

const fmt = (n: number | null) =>
  n == null ? '' : n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',').replace(',0', '')}K abonnés` : `${n} abonnés`;

export default function YouTubeDropdown({ variant = 'ink', drop = 'down' }: { variant?: 'red' | 'ink' | 'ghost'; drop?: 'down' | 'up' }) {
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<Live[]>(
    youtubeChannels.map((c) => ({ ...c, subscribers: null, avatar: null }))
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/youtube')
      .then((r) => r.json())
      .then((d) => d?.channels && setChannels(d.channels))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const cls = variant === 'red' ? 'btn btn-red' : variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-ink';

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={cls} aria-haspopup="menu" aria-expanded={open}>
        <YoutubeIcon className="h-4 w-4" /> Nos chaînes <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute right-0 z-[80] w-[300px] rounded-2xl border-2 border-ink/10 bg-white p-2 shadow-2xl ${drop === 'down' ? 'top-full mt-3' : 'bottom-full mb-3'}`}
        >
          <p className="label px-3 pb-2 pt-1 text-mist">trois chaînes, trois univers</p>
          {channels.map((c) => (
            <a
              key={c.handle}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper"
            >
              {c.avatar ? (
                <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-red/10 text-red">
                  <YoutubeIcon className="h-4 w-4" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-semibold">{c.name}</span>
                <span className="block truncate text-xs text-mist">{c.positioning}</span>
              </span>
              {c.subscribers != null && (
                <span className="stamp !px-2 !py-1 !text-[9px] !border-sun !text-sun">{fmt(c.subscribers)}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}