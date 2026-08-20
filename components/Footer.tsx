// components/Footer.tsx
"use client";
import { useState, type MouseEvent } from "react";
import { brandData, navigation, youtubeChannels, mediaKitUrl } from "@/data/viree";
import { useMediaImage } from "@/lib/useMedia";
import { useApiFetch } from "@/lib/useToastApi";

export default function Footer() {
  const [on, setOn] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const footerOffUrl = useMediaImage("footerOff");
  const footerOnUrl = useMediaImage("footerOn");
  const apiFetch = useApiFetch();

  const toggle = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button, input")) return;
    setOn(!on);
  };

  // ⭐ Gestion du téléchargement media kit avec toast
 // components/Footer.tsx et sections.tsx (BrandsSection)

const handleMediaKitDownload = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (downloading) return;

  setDownloading(true);
  try {
    const res = await apiFetch(
      mediaKitUrl,
      {},
      'Téléchargement du media kit démarré' // ⭐ Message de succès
    );
    if (res.ok) {
      const a = document.createElement('a');
      a.href = mediaKitUrl;
      a.download = 'La-Viree-d-Hector-Media-Kit.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } finally {
    setDownloading(false);
  }
};

  return (
    <footer className="relative overflow-hidden bg-ink text-paper" onClick={toggle}>
      <div className="relative h-[300px] w-full sm:h-[400px] md:h-[520px]" aria-hidden="true">
        {footerOffUrl ? (
          <img
            src={footerOffUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-contain object-center md:object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink to-ink/80 animate-pulse" />
        )}

        {footerOnUrl && (
          <img
            src={footerOnUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-contain object-center md:object-cover transition-opacity duration-700 ${
              on ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(22,41,74,0.5) 0%, rgba(22,41,74,0) 28%, rgba(22,41,74,0) 55%, rgba(22,41,74,0.9) 86%, rgb(22,41,74) 100%)",
          }}
        />
        <p className="hand absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-2xl text-paper/85">
          {on ? "cliquez pour éteindre Hector" : "cliquez pour allumer Hector"}
        </p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 pb-10 pt-10 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-bold">La Virée d'Hector</p>
          <p className="hand mt-2 text-2xl text-sun">{brandData.tagline}</p>
          <p className="mt-3 max-w-xs text-sm text-paper/70">
            {brandData.couple} · {brandData.truck}.
          </p>
        </div>

        <nav className="flex flex-col items-start gap-3">
          {navigation.map((n) => (
            <a key={n.href} href={n.href} className="w-fit text-sm font-semibold text-paper/75 hover:text-sun">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-3 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setYtOpen((o) => !o)}
            className="hover:text-sun"
            aria-expanded={ytOpen}
          >
            YouTube {ytOpen ? "−" : "+"}
          </button>
          {ytOpen &&
            youtubeChannels.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pl-3 text-paper/60 hover:text-sun"
              >
                {c.name}
              </a>
            ))}
          <a href={brandData.tiktok.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">
            TikTok {brandData.tiktok.handle}
          </a>
          <a href={brandData.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">
            Instagram {brandData.instagram.handle}
          </a>
          <a href={brandData.facebook.url} target="_blank" rel="noopener noreferrer" className="hover:text-sun">
            Facebook
          </a>
          {/* ⭐ Bouton media kit avec gestion d'erreur */}
          <button
            type="button"
            onClick={handleMediaKitDownload}
            disabled={downloading}
            className="hover:text-sun disabled:opacity-50 text-left"
          >
            {downloading ? "Téléchargement..." : "Media kit (PDF)"}
          </button>
        </div>
      </div>

      <p className="relative z-10 border-t border-paper/10 py-6 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} La Virée d'Hector ·{" "}
        <a href="/mentions-legales" className="hover:text-sun">
          Mentions légales
        </a>
      </p>
    </footer>
  );
}