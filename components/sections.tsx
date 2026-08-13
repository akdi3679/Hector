"use client";
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import { Globe, Truck, BatteryCharging, Camera, Coffee, Cpu } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon, TiktokIcon } from './SocialIcons';
import { brandData, navigation, videos, storyData, platforms, formats, collabs, reviews, products, gallery, gear , moments } from '@/data/viree';
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
            <a href={brandData.youtube.url} target="_blank" rel="noopener noreferrer" className="btn btn-red">Voir nos vidéos</a>
            <a href="#marques" className="btn btn-ink">Espace marques</a>
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
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect(); // compte une seule fois
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = [
    { icon: <YoutubeIcon className="h-5 w-5" />, value: <CountValue target={3} started={started} />, label: 'chaînes YouTube' },
    { icon: <InstagramIcon className="h-5 w-5" />, value: <CountValue target={11.6} suffix="K" decimals={1} started={started} />, label: 'abonnés Instagram' },
    { icon: <FacebookIcon className="h-5 w-5" />, value: <CountValue target={7.5} suffix="K" decimals={1} started={started} />, label: 'abonnés Facebook' },
    { icon: <TiktokIcon className="h-5 w-5" />, value: <span>∞</span>, label: 'virées en vertical' },
    { icon: <Globe className="h-5 w-5" />, value: <span>monde</span>, label: 'notre terrain de jeu' },
  ];

  return (
    <section ref={ref} className="bg-ink py-12 text-paper">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-8 px-5 sm:grid-cols-5 md:px-8">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border border-sun/40 text-sun">{s.icon}</span>
            <p className="font-display text-3xl font-semibold text-sun">{s.value}</p>
            <p className="label mt-2 text-paper/70">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function VideosSection() {
  return (
    <section id="videos" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <Head hand="cliquez, ça se regarde" title="Nos dernières vidéos." sub="Découvertes, matériel, partenariats : le journal de bord en images, tel qu’on l’a vécu." />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {videos.map((v, i) => (
          <Reveal key={v.title} delay={(i % 4) * 90}>
            <a href={v.url} target="_blank" rel="noopener noreferrer" className={`group block polaroid ${i % 2 ? 'rotate-1' : '-rotate-1'} transition-transform duration-300 hover:rotate-0`}>
              <div className="card-img relative aspect-[4/3] overflow-hidden">
                <img src={v.image} alt={v.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 grid place-items-center">
<span className="play-pulse grid h-12 w-12 place-items-center rounded-full bg-red text-paper shadow-lg transition-transform duration-300 group-hover:scale-110">▶</span>                </span>
              </div>
              <p className="label mt-4 text-sunset">{v.tag}</p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:text-sunset">{v.title}</h3>
              <p className="hand pt-2 text-xl text-mist">{v.note}</p>
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
  return (
    <section id="ecosysteme" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="trois chaînes, une même route" title="L’écosystème." sub="YouTube raconte, TikTok allume l’étincelle, Instagram et Facebook font vivre la communauté." />
        <div className="grid gap-6 md:grid-cols-3">
          {platforms.map((p, i) => (
            <Reveal key={p.name} delay={i * 90} className={p.main ? 'md:col-span-3' : ''}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className={`ticket group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 ${p.main ? 'bg-sun/20 md:flex-row md:items-center md:gap-10' : ''}`}>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">{p.desc}</p>
                </div>
                <span className={`btn mt-6 w-fit ${p.main ? 'btn-red' : 'btn-ghost'} !px-5 !py-3`}>{p.main ? 'Tout voir sur YouTube' : 'Suivre'}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export function MaterialSection() {
  const icons = [Truck, BatteryCharging, Camera, Coffee, Cpu];
  return (
    <section id="materiel" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-5 pb-20 md:px-8 md:pb-28">
      <Head
        hand="ce qu'on a vraiment à bord"
        title="Le matériel qui vit avec nous."
        sub="Chaque objet à bord a été choisi, testé, parfois cassé, parfois adoré. C'est aussi ici que votre produit peut trouver sa place."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {gear.map((g, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal key={g.name} delay={i * 80}>
              <div className="ticket h-full p-6">
                <Icon className="h-6 w-6 text-sunset" />
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{g.name}</h3>
                <p className="label mt-2 text-sunset">{g.role}</p>
                <p className="hand pt-2 text-xl text-mist">{g.note}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-10">
        <p className="hand text-2xl text-sunset">
          votre produit peut rejoindre cette liste — et rester à bord des mois, pas une semaine.
        </p>
      </Reveal>
    </section>
  );
}
export function BrandsSection() {
  return (
    <section id="marques" className="bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto grid w-full max-w-[1280px] gap-14 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <p className="hand mb-2 text-2xl text-sun">pour les marques & agences</p>
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Votre produit, en route avec nous.</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-paper/75">
            Notre audience prépare sa propre vie nomade : elle équipe, finance et achète. Votre marque y a une place naturelle — si elle est vraie.
          </p>
          <div className="mt-10 space-y-4">
            {formats.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="ticket !border-paper/25 !bg-paper/5 p-5">
                  <p className="font-display text-lg font-semibold text-sun">{i + 1}. {f.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-paper/70">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="lg:pt-24">
          <Reveal>
            <p className="label text-paper/60">Ils nous ont fait confiance</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {collabs.map((c) => <span key={c} className="stamp !border-sun !text-sun">{c}</span>)}
            </div>
            <div className="mt-10 rounded-2xl bg-sun p-7 text-ink">
              <p className="hand text-3xl">parlons de votre projet</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                Les chiffres qui comptent (YouTube, démographie, engagement) sont dans notre media kit PDF — envoyé sur demande, gratuitement.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={brandData.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ink">Demander le media kit</a>
                <a href={brandData.youtube.url} target="_blank" rel="noopener noreferrer" className="btn !border-2 !border-ink/30 text-ink hover:border-ink">Juger sur pièces</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-20 md:px-8 md:py-28">
      <Head hand="ce qui nous fait avancer" title="Vos messages nous portent." sub="Quelques mots reçus en DM et en commentaires — la raison pour laquelle on ne lâche rien." />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <Reveal key={i} delay={(i % 4) * 90}>
            <figure className={`polaroid ${i % 2 ? 'rotate-1' : '-rotate-1'} p-6`}>
              <blockquote className="hand text-2xl leading-snug">« {r.text} »</blockquote>
              <figcaption className="label mt-4 text-mist">{r.from}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function BoutiqueSection() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head hand="un morceau de la route chez vous" title="La boutique." sub="De petites choses pensées et faites en chemin. Bientôt disponibles — laissez votre email plus bas pour être prévenus en premier." />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 90}>
              <article className="group polaroid">
                <div className="card-img aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-baseline justify-between gap-3 pt-4">
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <span className="hand text-xl text-sunset">{p.price}</span>
                </div>
                <p className="pt-1 text-sm text-mist">{p.desc}</p>
                <a href="#newsletter" className="btn btn-ghost mt-4 !px-5 !py-2.5">Me prévenir</a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export function MomentsSection() {
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <Head
          hand="ce qu’on n’oubliera jamais"
          title="Les moments inoubliables."
          sub="Il y a des instants qui justifient tout le reste. Faites défiler — comme on feuillette un album."
        />
      </div>
      <Reveal>
        <div className="moments-strip flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:px-[max(2rem,calc((100vw-1280px)/2))]">
          {moments.map((m, i) => (
            <figure key={m.caption} className={`polaroid breathe w-[260px] shrink-0 snap-center md:w-[320px] ${i % 2 ? 'rotate-1' : '-rotate-1'}`}>
              <div className="card-img aspect-[4/5] overflow-hidden">
                <img src={m.image} alt={m.caption} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <figcaption className="flex items-baseline justify-between gap-3 pt-3">
                <span className="hand text-2xl leading-none">{m.caption}</span>
                <span className="stamp shrink-0 !px-3 !py-1.5 !text-[9px]">{m.emotion}</span>
              </figcaption>
            </figure>
          ))}
          {/* la dernière carte parle aux marques */}
          <div className="flex w-[260px] shrink-0 snap-center items-center justify-center md:w-[320px]">
            <p className="hand text-center text-3xl text-sunset">les prochains se vivront peut-être avec votre marque.</p>
          </div>
        </div>
      </Reveal>
      <p className="hand mt-2 text-center text-2xl text-mist">faites défiler →</p>
    </section>
  );
}
export function GallerySection() {
  const [idx, setIdx] = useState<number | null>(null);
  return (
    <section id="galerie" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <Head hand="la route en images" title="La galerie." sub="Cliquez sur une photo pour la voir en grand." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {gallery.map((g, i) => (
          <Reveal key={g.src} delay={(i % 3) * 80}>
            <button onClick={() => setIdx(i)} className="card-img group block aspect-square w-full overflow-hidden rounded-xl border-2 border-ink/10 focus-visible:outline-2 focus-visible:outline-sunset">
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover" />
            </button>
          </Reveal>
        ))}
      </div>
      {idx !== null && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-6" role="dialog" aria-modal="true" onClick={() => setIdx(null)}>
<img src={gallery[idx].src} alt={gallery[idx].alt} className="lightbox-img max-h-[85vh] max-w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
          <button className="btn btn-ghost !border-paper/40 !text-paper absolute left-4 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); setIdx((idx + gallery.length - 1) % gallery.length); }}>←</button>
          <button className="btn btn-ghost !border-paper/40 !text-paper absolute right-4 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % gallery.length); }}>→</button>
          <button className="btn btn-red absolute right-4 top-4" onClick={() => setIdx(null)}>Fermer</button>
        </div>
      )}
    </section>
  );
}

export function NewsletterSection() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  return (
    <section id="newsletter" className="mx-auto w-full max-w-[1280px] scroll-mt-24 px-5 pb-20 md:px-8 md:pb-28">
      <Reveal className="ticket mx-auto max-w-2xl p-8 text-center md:p-12">
        <p className="hand text-3xl text-sunset">la lettre de la route</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Des nouvelles d’Hector, de temps en temps.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mist">Une lettre quand il se passe quelque chose : nouvelle étape, nouvelle vidéo, ouverture de la boutique. Jamais de spam.</p>
        {done ? (
          <p className="hand mt-8 text-2xl text-sunset">Merci ! À très vite sur la route.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input required type="email" placeholder="votre@email.fr" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 rounded-full border-2 border-ink/20 bg-white px-5 py-3 outline-none focus:border-sunset" />
            <button type="submit" className="btn btn-ink shrink-0">Je monte à bord</button>
          </form>
        )}
      </Reveal>
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
          <a href={brandData.youtube.url} target="_blank" rel="noopener noreferrer" className="btn btn-red">S’abonner sur YouTube</a>
          <a href={brandData.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ink">Suivre la virée</a>
        </div>
      </Reveal>
    </section>
  );
}