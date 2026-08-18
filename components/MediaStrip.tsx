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
      {/* ⭐ pb-20 = laisse place à l'ombre du polaroid (42px) + scrollbar (8px) */}
      <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-20 md:px-[max(2rem,calc((100vw-1280px)/2))]">
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

        {/* ⭐ Bouton "Voir plus" : petit rond DANS la bande, après les images */}
        {next && (
          <div className={`flex shrink-0 snap-center items-center justify-center ${tall ? 'w-[140px]' : 'w-[140px]'}`}>
            <button
              type="button"
              onClick={() => load(next.cursor)}
              disabled={loading}
              className="group flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink/20 bg-white text-ink shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-sunset hover:text-sunset hover:shadow-lg disabled:opacity-50"
              aria-label="Charger plus de médias"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-sunset border-t-transparent"></span>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      <p className="hand -mt-10 text-center text-2xl text-mist">faites défiler →</p>
    </div>
  );
}