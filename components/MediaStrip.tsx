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
    {/* ⭐ Conteneur de scroll avec padding-bottom pour la scrollbar */}
    <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto pl-5 pr-5">
      {items.map((m, i) => (
        <div
          key={m.id}
          className={`polaroid shrink-0 snap-center ${i % 2 ? 'rotate-1' : '-rotate-1'} ${tall ? 'w-[300px] md:w-[340px]' : 'w-[260px] md:w-[320px]'}`}
        >
          {/* ⭐ Conteneur individuel qui protège l'image */}
          <div className={`card-img w-full overflow-hidden ${h}`}>
            {m.type === 'video' ? (
              <video
                src={m.url}
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={m.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      ))}

      {/* Bouton Voir plus */}
      {next && (
        <button
          type="button"
          onClick={() => load(next.cursor)}
          disabled={loading}
          className="flex h-[240px] w-[120px] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-xl border-2 border-ink/20 bg-transparent text-ink transition-all duration-300 hover:-translate-y-1 hover:border-sunset hover:text-sunset disabled:opacity-50"
          aria-label="Charger plus de médias"
        >
          {loading ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-sunset border-t-transparent"></span>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
            </svg>
          )}
          <span className="text-xs font-bold uppercase tracking-wider">
            {loading ? 'Chargement' : 'Voir plus'}
          </span>
        </button>
      )}
    </div>

    <p className="hand mt-2 text-center text-2xl text-mist">faites défiler →</p>
  </div>
);
}