"use client";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { useSiteData } from '@/lib/site-data';

const fmt = (n: number | null) =>
  n == null ? '' : n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',').replace(',0', '')}K` : `${n}`;

export default function YouTubeDropdown({ variant = 'ink' }: { variant?: 'red' | 'ink' | 'ghost' }) {
  const { channels } = useSiteData();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const W = 300, H = 280;
      const left = Math.min(Math.max(8, r.right - W), window.innerWidth - W - 8);
      let top = r.bottom + 8;
      if (top + H > window.innerHeight - 8) top = Math.max(8, r.top - H - 8);
      setPos({ top, left });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if ((t as Element).closest?.('[data-yt-menu]')) return;
      setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const cls = variant === 'red' ? 'btn btn-red' : variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-ink';

  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle} className={cls} aria-haspopup="menu" aria-expanded={open}>
        <YoutubeIcon className="h-4 w-4" /> Nos chaînes <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <div data-yt-menu role="menu"
          className="fixed z-[100] w-[300px] rounded-2xl border-2 border-ink/10 bg-white p-2 shadow-2xl"
          style={{ top: pos.top, left: pos.left }}>
          <p className="label px-3 pb-2 pt-1 text-mist">trois chaînes, trois univers</p>
          {channels.map((c) => (
            <a key={c.handle} href={c.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper">
              {c.avatar
                ? <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                : <span className="grid h-9 w-9 place-items-center rounded-full bg-red/10 text-red"><YoutubeIcon className="h-4 w-4" /></span>}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-semibold">{c.name}</span>
                <span className="block truncate text-xs text-mist">{c.positioning}</span>
              </span>
              {c.subscribers != null && <span className="stamp !px-2 !py-1 !text-[9px] !border-sun !text-sun">{fmt(c.subscribers)} abonnés</span>}
            </a>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}