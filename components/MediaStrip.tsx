"use client";
import { useEffect, useState } from 'react';

interface Item { id: string; url: string; type: 'image' | 'gif' | 'video'; }

export default function MediaStrip({ folder, tall = false }: { folder: string; tall?: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [next, setNext] = useState<{ cursor: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (cursor?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const p = new URLSearchParams({ folder });
      if (cursor) p.set('cursor', cursor);
      const res = await fetch(`/api/media?${p}`);
      const d = await res.json();
      if (Array.isArray(d.items)) {
        setItems((prev) => [...prev, ...d.items]);
        setNext(d.next);
      }
    } catch (err) {
      console.error('Media load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const h = tall ? 'h-[420px]' : 'h-[320px]';

  return (
    <div>
      {/* Bande de scroll — padding-bottom pour laisser place à la scrollbar */}
      <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-5 md:px-[max(2rem,calc((100vw-1280px)/2))]">
        {items.map((m, i) => (
          <div key={m.id} className={`polaroid shrink-0 snap-center ${i % 2 ? 'rotate-1' : '-rotate-1'} ${tall ? 'w-[300px] md:w-[340px]' : 'w-[260px] md:w-[320px]'}`}>
            <div className={`card-img ${h} w-full overflow-hidden`}>
              {m.type === 'video' ? (
                <video src={m.url} muted loop playsInline preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                  className="h-full w-full object-cover" />
              ) : (
                <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bouton "Voir plus" — petit, rond, sous la bande */}
      {next && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => load(next.cursor)}
            disabled={loading}
            className="group flex items-center gap-2 rounded-full border-2 border-ink/20 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-sunset hover:text-sunset disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sunset border-t-transparent"></span>
                Chargement
              </>
            ) : (
              <>
                <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
                Voir plus
              </>
            )}
          </button>
        </div>
      )}

      <p className="hand mt-4 text-center text-2xl text-mist">faites défiler →</p>
    </div>
  );
}