// app/cgu/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation',
  description: 'CGU du site La Virée d\'Hector',
};

export default function CGU() {
  return (
    <div className="min-h-screen bg-paper text-ink py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">
          Conditions Générales d'Utilisation
        </h1>
        
        <div className="space-y-10 text-foreground/80 leading-relaxed">
          {/* Objet */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) encadrent 
              l'accès et l'utilisation du site La Virée d'Hector.
            </p>
            <p className="mt-3">
              En accédant à ce site, vous acceptez sans réserve les présentes CGU.
            </p>
          </section>

          {/* Accès */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              2. Accès au site
            </h2>
            <p>
              Le site est accessible gratuitement à tout utilisateur disposant 
              d'un accès à Internet. Les frais de connexion sont à la charge de 
              l'utilisateur.
            </p>
            <p className="mt-3">
              La Virée d'Hector se réserve le droit de suspendre ou interrompre 
              l'accès au site à tout moment, sans préavis.
            </p>
          </section>

          {/* Utilisation */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              3. Utilisation du site
            </h2>
            <p>
              L'utilisateur s'engage à utiliser le site de manière conforme à sa 
              destination. Sont notamment interdits :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Toute tentative de piratage ou d'accès non autorisé</li>
              <li>La surcharge volontaire des serveurs</li>
              <li>La reproduction non autorisée des contenus</li>
              <li>L'utilisation de robots de scraping</li>
            </ul>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              4. Responsabilité
            </h2>
            <p>
              La Virée d'Hector ne pourra être tenue responsable des dommages 
              directs ou indirects résultant de l'utilisation du site.
            </p>
          </section>

          {/* Liens externes */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              5. Liens externes
            </h2>
            <p>
              Le site contient des liens vers des sites tiers (YouTube, Instagram, 
              TikTok, Facebook). La Virée d'Hector n'exerce aucun contrôle sur ces 
              sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              6. Modifications des CGU
            </h2>
            <p>
              La Virée d'Hector se réserve le droit de modifier les présentes CGU 
              à tout moment. Les modifications entrent en vigueur dès leur publication.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              7. Droit applicable
            </h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>
          </section>

          {/* Liens */}
          <div className="pt-8 border-t border-ink/10 flex flex-wrap gap-6 text-sm">
            <Link href="/mentions-legales" className="text-sunset hover:underline">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-sunset hover:underline">
              Politique de confidentialité
            </Link>
            <Link href="/politique-cookies" className="text-sunset hover:underline">
              Politique cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}