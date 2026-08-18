"use client";
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import YouTubeDropdown from './YouTubeDropdown';
import MediaStrip from './MediaStrip';
import { useSiteData } from '@/lib/site-data';
import { Globe, ChevronLeft } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon, TiktokIcon } from './SocialIcons';
import {
  brandData, navigation, videos, storyData, platforms, formats, collabs , products, gallery, moments, youtubeChannels, fallbackLatestVideos,
  mediaKitUrl, material,
} from '@/data/viree';
import { socialStats } from '@/data/viree';
import { brandsAudience } from '@/data/viree';

import type { YoutubeChannel } from '@/data/viree';
function Head({ hand, title, sub }: { hand: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="hand mb-2 text-2xl text-sunset">{hand}</p>
      <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 max-w-xl leading-relaxed text-mist">{sub}</p>}
    </Reveal>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-14 px-5 pb-16 md:grid-cols-12 md:px-8 md:pb-24">
        <div className="md:col-span-7">
          <p className="stamp mb-8">{brandData.couple} · Hector — depuis {brandData.since}</p>
          <h1 className="font-display text-[10vw] font-semibold leading-[1.02] sm:text-6xl md:text-7xl">
            On a tout quitté pour vivre <em className="text-sunset">la route</em>.
          </h1>
          <p className="hand relative mt-5 inline-block text-3xl text-sunset">
  …et on vous raconte tout.
  <svg className="draw-line" viewBox="0 0 240 14" aria-hidden="true">
    <path d="M4 9c45-6 85 5 122-2 34-6 70 3 110-4" />
  </svg>
</p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-mist md:text-lg">
            Un camion aménagé nommé Hector, trois chaînes YouTube, et le monde comme jardin. Montez à bord — ou travaillons ensemble.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
                     <div className="mt-10 flex flex-wrap gap-4">
            <YouTubeDropdown variant="red" />
            <a href="#marques" className="btn btn-ink">Espace marques</a>
          </div>
 </div>
        </div>
        <div className="relative md:col-span-5">
          <div className="polaroid polaroid-float rotate-2">
            <div className="card-img aspect-[4/5] overflow-hidden">
<img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop" alt="Un camion aménagé au campement, le soir" fetchPriority="high" className="h-full w-full object-cover" />
            </div>
            <p className="hand pt-3 text-center text-2xl">Hector, notre maison</p>
          </div>
          <p className="stamp absolute -left-5 top-8 -rotate-12 !border-sun !text-sun">{brandData.tagline}</p>
        </div>
      </div>
      <div className="roadline" />
    </section>
  );
}

/* ---------- compteurs animés ---------- */
function CountValue({ target, suffix = '', decimals = 0, started }: { target: number; suffix?: string; decimals?: number; started: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const duration = 1800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4); // smooth slow-out
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);
  const shown = decimals ? val.toFixed(decimals).replace('.', ',') : Math.round(val).toString();
  return <span>{shown}{suffix}</span>;
}


export function StatsStrip() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const { channels } = useSiteData();
  const ytTotal = channels.reduce((a: number, c: any) => a + (c.subscribers ?? 0), 0);

  // Map les icônes
  const icons: Record<string, any> = {
    'youtube': <YoutubeIcon className="h-5 w-5" />,
    'youtube-total': <YoutubeIcon className="h-5 w-5" />,
    'instagram': <InstagramIcon className="h-5 w-5" />,
    'facebook': <FacebookIcon className="h-5 w-5" />,
    'tiktok': <TiktokIcon className="h-5 w-5" />,
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = socialStats.map((s) => ({
    ...s,
    value: s.platform === 'youtube-total' && ytTotal > 0 ? ytTotal : s.value,
    icon: icons[s.platform],
  }));

  return (
    <section ref={ref} className="bg-ink py-12 text-paper">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-8 px-5 sm:grid-cols-5 md:px-8">
        {items.map((s, i: number) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="group block" aria-label={s.label}>
              <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border border-sun/40 text-sun transition-transform group-hover:scale-110">{s.icon}</span>
              <p className="font-display text-3xl font-semibold text-sun">
                {s.platform === 'youtube-total' && ytTotal > 0 ? (
                  <CountValue target={ytTotal} started={started} />
                ) : s.suffix === '∞' ? (
                  <span>∞</span>
                ) : (
                  <CountValue target={s.value} suffix={s.suffix} decimals={s.decimals} started={started} />
                )}
              </p>
              <p className="label mt-2 text-paper/70">{s.label}</p>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function VideosSection() {
  const { videos } = useSiteData();
  return (
    <section id="videos" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <Head hand="cliquez, ça se regarde" title="Nos dernières vidéos." sub="Les 4 dernières vidéos publiées sur nos chaînes, mises à jour automatiquement." />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v: any, i: number) => (
          <Reveal key={v.title} delay={(i % 4) * 90}>
            <a href={v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : v.channelUrl} target="_blank" rel="noopener noreferrer"
               className={`group block polaroid ${i % 2 ? 'rotate-1' : '-rotate-1'} transition-transform duration-300 hover:rotate-0`}>
              <div className="card-img relative aspect-[4/3] overflow-hidden">
                <img src={v.thumb} alt={v.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="play-pulse grid h-12 w-12 place-items-center rounded-full bg-red text-paper shadow-lg transition-transform duration-300 group-hover:scale-110">▶</span>
                </span>
              </div>
              <p className="label mt-4 text-sunset">{v.channel}{v.publishedAt && ` · ${new Date(v.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}</p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-sunset">{v.title}</h3>
              {v.description && <p className="mt-2 text-sm text-mist line-clamp-2">{v.description}</p>}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section id="apropos" className="mx-auto grid w-full max-w-[1280px] items-center gap-14 px-5 pb-20 md:px-8 md:pb-28 lg:grid-cols-2">
      <Reveal>
        <div className="polaroid -rotate-1">
          <div className="card-img aspect-[4/5] overflow-hidden">
            <img src="/images/sophie-marc.jpg" alt="Sophie et Jean-Marc, le couple derrière La Virée d'Hector" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <p className="hand pt-3 text-center text-2xl">nous, en vrai</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {storyData.timeline.map((t, i) => (
            <span key={t} className={`stamp ${i % 2 ? 'rotate-1 !border-ink/40 !text-ink/60' : '-rotate-1'}`}>{t}</span>
          ))}
        </div>
      </Reveal>
      <div>
        <Head hand="notre histoire" title={storyData.title} />
        <Reveal delay={100}>
          {storyData.paragraphs.map((p, i) => <p key={i} className="mb-5 max-w-xl leading-relaxed text-mist">{p}</p>)}
          <p className="hand mt-6 text-3xl text-sunset">{storyData.signature}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function EcosystemSection() {
  const [split, setSplit] = useState(false);

  return (
    <section id="ecosysteme" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="trois chaînes, une même route" title="L’écosystème." sub="YouTube raconte, TikTok allume l’étincelle, Instagram et Facebook font vivre la communauté." />

        {!split ? (
          <Reveal>
            <button type="button" onClick={() => setSplit(true)}
              className="ticket group block w-full bg-sun/20 p-10 text-left transition-all duration-300 hover:-translate-y-1 md:p-14">
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <YoutubeIcon className="h-10 w-10 text-red" />
                  <h3 className="mt-4 font-display text-3xl font-semibold md:text-4xl">YouTube — trois chaînes, trois univers</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
                    Partenariats & produits nomades · énergie & maison · voyages & destinations. Cliquez pour découvrir où votre marque trouve sa place.
                  </p>
                </div>
                <span className="btn btn-red shrink-0">Découvrir les 3 chaînes</span>
              </div>
            </button>
          </Reveal>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
             {youtubeChannels.map((c: YoutubeChannel, i: number) => (
  <Reveal key={c.id} delay={i * 90}>
    <a href={c.url} target="_blank" rel="noopener noreferrer"
       aria-label={`Voir la chaîne YouTube ${c.name}`}
       className="ticket group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1">
      <YoutubeIcon className={`h-7 w-7 ${c.accent === 'red' ? 'text-red' : c.accent === 'sun' ? 'text-sunset' : 'text-sky'}`} />
      <h3 className="mt-4 font-display text-2xl font-semibold">{c.name}</h3>
      <p className="label mt-2 text-sunset">{c.positioning}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{c.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {c.themes.map((t: string) => (
          <span key={t} className="rounded-full bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink/70">{t}</span>
        ))}
      </div>
      <span className="btn btn-ghost mt-6 w-fit !px-5 !py-2.5">Voir la chaîne</span>
    </a>
  </Reveal>
))}
            </div>
            <button type="button" onClick={() => setSplit(false)} className="btn btn-ghost mt-8 !px-5 !py-2.5">
              <ChevronLeft size={14} /> Revenir à l’écosystème
            </button>
          </>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {platforms.filter((p) => p.name !== 'YouTube').map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="ticket group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{p.desc}</p>
                <span className="btn btn-ghost mt-6 w-fit !px-5 !py-3">Suivre</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export function MaterialSection() {
  return (
    <section id="materiel" className="scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="ce qu'on a vraiment à bord" title="Le matériel qui vit avec nous."
          sub="Chaque objet a été choisi, testé, parfois cassé, parfois adoré. C'est ici que votre produit trouve sa place." />
      </div>
      <Reveal>
        <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:px-[max(2rem,calc((100vw-1280px)/2))]">
          {material.map((g, i) => {
            const Icon = g.icon;
            return (
              <div key={g.name} className="ticket w-[260px] shrink-0 snap-center p-6 md:w-[300px]">
                <Icon className="h-6 w-6 text-sunset" />
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{g.name}</h3>
                <p className="label mt-2 text-sunset">{g.role}</p>
                <p className="hand pt-2 text-xl text-mist">{g.note}</p>
              </div>
            );
          })}
          <div className="flex w-[260px] shrink-0 snap-center items-center justify-center md:w-[300px]">
            <p className="hand text-center text-2xl text-sunset">votre produit peut rejoindre cette liste — et rester à bord des mois.</p>
          </div>
        </div>
      </Reveal>
      <p className="hand mt-2 text-center text-2xl text-mist">faites défiler →</p>
    </section>
  );
}
export function BrandsSection() {
  return (
    <section id="marques" className="bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="pour les marques & agences" title="Votre produit, en route avec nous."
          sub="Notre audience prépare sa propre vie nomade : elle équipe, finance et achète. Votre marque y a une place naturelle — si elle est vraie." />

        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 font-display text-2xl font-semibold text-sun">Formats de collaboration</h3>
            <div className="space-y-4">
              {formats.map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                  <div className="ticket !border-paper/25 !bg-paper/5 p-5">
                    <p className="font-display text-lg font-semibold text-sun">{i + 1}. {f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-paper/70">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* NOUVEAU : comment ça se passe */}
            <h3 className="mb-4 mt-12 font-display text-2xl font-semibold text-sun">Comment ça se passe</h3>
            <div className="space-y-3">
              {['Brief & envoi du produit', 'Test réel de plusieurs semaines', 'Contenu honnête publié sur la bonne chaîne', 'Chiffres & rapport post-campagne'].map((s, i) => (
                <Reveal key={s} delay={i * 60}>
                  <div className="flex items-center gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun font-display font-bold text-ink">{i + 1}</span>
                    <p className="text-sm text-paper/80">{s}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:pt-2">
            <Reveal>
              <p className="label text-paper/60">Ils nous ont fait confiance</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {collabs.map((c) => <span key={c} className="stamp !border-sun !text-sun">{c}</span>)}
              </div>
              <p className="mt-3 text-xs text-paper/50">Collaborations réelles — vérifiables sur nos chaînes.</p>
            </Reveal>

            {/* NOUVEAU : audience snapshot */}
           <Reveal delay={80}>
  <div className="ticket !border-paper/25 !bg-paper/5 p-6">
    <p className="label mb-4 text-paper/60">Audience cumulée</p>
    <div className="grid grid-cols-2 gap-4 text-center">
      {brandsAudience.map((item) => (
        <div key={item.label}>
          <p className="font-display text-2xl font-semibold text-sun">{item.value}</p>
          <p className="text-xs text-paper/60">{item.label}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-paper/50">Détails démographie & engagement dans le media kit.</p>
  </div>
</Reveal>

            {/* MEDIA KIT — emplacement professionnel */}
            <Reveal delay={160}>
              <div className="rounded-2xl bg-sun p-7 text-ink">
                <p className="hand text-3xl">parlons de votre projet</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">
                  Le media kit (audiences détaillées, démographie, exemples de vidéos, tarifs) est envoyé gratuitement sur demande.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={mediaKitUrl} download="La-Viree-d-Hector-Media-Kit.pdf" className="btn btn-ink">
  Demander le media kit
</a>
                  <YouTubeDropdown variant="ghost" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: 'bg-red/15 text-red' },
  facebook: { label: 'Facebook', color: 'bg-sky/20 text-sky' },
  instagram: { label: 'Instagram', color: 'bg-sunset/15 text-sunset' },
  tiktok: { label: 'TikTok', color: 'bg-ink/10 text-ink' },
};

export function ReviewsSection() {
  const { reviews } = useSiteData();

  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
      <Head
        hand="ce qui nous fait avancer"
        title="Vos messages nous portent."
        sub="Témoignages de notre communauté — cliquez pour voir la source."
      />
      
      {/* Mobile: scroll horizontal */}
      <div className="md:hidden">
        <div className="moments-strip -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6">
          {reviews.map((r: any, i: number) => {
            const sourceMeta = SOURCE_LABELS[r.source] ?? { label: r.source, color: 'bg-mist/20 text-mist' };
            const inner = (
              <figure className={`polaroid h-full shrink-0 w-[280px] snap-center ${i % 2 ? 'rotate-1' : '-rotate-1'} p-6`}>
                <blockquote className="hand text-2xl leading-snug">« {r.text} »</blockquote>
                <figcaption className="mt-4 space-y-1.5">
                  <div className="label flex items-center justify-between text-mist">
                    <span>{r.author}</span>
                    {r.likes > 0 && <span className="text-sunset">♥ {r.likes}</span>}
                  </div>
                  {r.channel && <p className="truncate text-xs font-semibold text-sunset">{r.channel}</p>}
                  {r.videoTitle && <p className="truncate text-xs text-mist/70">{r.videoTitle}</p>}
                </figcaption>
                <span className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${sourceMeta.color}`}>
                  {sourceMeta.label}
                </span>
              </figure>
            );

            return (
              <Reveal key={i} delay={(i % 3) * 90}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-1">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
        <p className="hand mt-2 text-center text-2xl text-mist">faites défiler →</p>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r: any, i: number) => {
          const sourceMeta = SOURCE_LABELS[r.source] ?? { label: r.source, color: 'bg-mist/20 text-mist' };
          const inner = (
            <figure className={`polaroid h-full ${i % 2 ? 'rotate-1' : '-rotate-1'} p-6`}>
              <blockquote className="hand text-2xl leading-snug">« {r.text} »</blockquote>
              <figcaption className="mt-4 space-y-1.5">
                <div className="label flex items-center justify-between text-mist">
                  <span>{r.author}</span>
                  {r.likes > 0 && <span className="text-sunset">♥ {r.likes}</span>}
                </div>
                {r.channel && <p className="truncate text-xs font-semibold text-sunset">{r.channel}</p>}
                {r.videoTitle && <p className="truncate text-xs text-mist/70">{r.videoTitle}</p>}
              </figcaption>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${sourceMeta.color}`}>
                {sourceMeta.label}
              </span>
            </figure>
          );

          return (
            <Reveal key={i} delay={(i % 3) * 90}>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-1">
                  {inner}
                </a>
              ) : (
                inner
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
export function MomentsSection() {
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="ce qu'on n'oubliera jamais" title="Les moments inoubliables." sub="Photos, vidéos, gifs — comme on feuillette un album." />
      </div>
      <Reveal><MediaStrip folder="hector/moments" tall /></Reveal>
    </section>
  );
}

export function GallerySection() {
  return (
    <section id="galerie" className="scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="la route en images" title="La galerie." sub="Les 20 derniers médias — chargez plus si vous voulez." />
      </div>
      <Reveal><MediaStrip folder="hector/galerie" /></Reveal>
    </section>
  );
}



export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-sun py-24 text-center text-ink md:py-32">
      <div className="roadline absolute inset-x-0 top-10 !opacity-30" />
      <Reveal className="relative z-10 mx-auto max-w-[1280px] px-5 md:px-8">
        <p className="hand text-3xl">montez à bord</p>
        <h2 className="mx-auto mt-2 max-w-3xl font-display text-5xl font-semibold md:text-7xl">{brandData.tagline}</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
                <div className="mt-10 flex flex-wrap justify-center gap-4">
          <YouTubeDropdown variant="red" />
          <a href={brandData.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ink">Suivre la virée</a>
        </div>
 </div>
      </Reveal>
    </section>
  );
}