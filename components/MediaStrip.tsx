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
    const controller = new AbortController();
    try {
      const p = new URLSearchParams({ folder });
      if (cursor) p.set('cursor', cursor);
      const res = await fetch(`/api/media?${p}`, { signal: controller.signal });
      const d = await res.json();
      if (Array.isArray(d.items)) {
        setItems((prev) => [...prev, ...d.items]);
        setNext(d.next);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error('Media load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const h = tall ? 'h-[420px]' : 'h-[320px]';

  return (
    <div className="py-8">
  <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 md:px-[max(2rem,calc((100vw-1280px)/2))]">
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
    
    {/* Bouton "Voir plus" */}
    {next && (
      <button 
        type="button" 
        onClick={() => load(next.cursor)} 
        disabled={loading}
        className="group relative flex h-[320px] w-[200px] shrink-0 snap-center flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-ink/20 bg-white/50 transition-all duration-300 hover:border-sunset hover:bg-sun/5 disabled:opacity-50"
      >
        <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-sunset transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:scale-110'}`}>
          {loading ? (
            <svg className="h-8 w-8 text-sunset" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-8 w-8 text-sunset" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        
        <div className="text-center">
          <p className="font-display text-lg font-semibold text-ink">
            {loading ? 'Chargement...' : 'Voir plus'}
          </p>
          <p className="mt-1 text-xs text-mist">
            20 médias supplémentaires
          </p>
        </div>
        
        <div className="absolute inset-x-8 bottom-6 h-0.5 bg-gradient-to-r from-transparent via-sunset to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      </button>
    )}
  </div>
  
  <p className="hand mt-4 text-center text-2xl text-mist">faites défiler →</p>
</div>
  );
}