"use client";
import { useEffect, useState } from 'react';

interface Item {
  id: string;
  url: string;
  type: 'image' | 'gif' | 'video';
}

export default function MediaStrip({ folder, tall = false }: { folder: string; tall?: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const [next, setNext] = useState<{ ci: string; cv: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (cursor?: { ci: string; cv: string }) => {
    setLoading(true);
    const p = new URLSearchParams({ folder });
    if (cursor) {
      p.set('ci', cursor.ci);
      p.set('cv', cursor.cv);
    }
    try {
      const d = await (await fetch(`/api/media?${p}`)).json();
      setItems((prev) => [...prev, ...d.items]);
      setNext(d.next);
    } catch (err) {
      console.error('Media load failed:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [folder]);

  const h = tall ? 'h-[420px]' : 'h-[320px]';

  return (
    <div>
      <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:px-[max(2rem,calc((100vw-1280px)/2))]">
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
        {next && (
          <button type="button" onClick={() => load(next)} disabled={loading}
            className="btn btn-ghost h-[320px] w-[180px] shrink-0 snap-center disabled:opacity-50">
            {loading ? '…' : 'Charger plus'}
          </button>
        )}
      </div>
      <p className="hand mt-2 text-center text-2xl text-mist">faites défiler →</p>
    </div>
  );
}