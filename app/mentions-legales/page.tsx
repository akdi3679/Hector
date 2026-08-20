// app/mentions-legales/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site La Virée d\'Hector',
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-paper text-ink py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">
          Mentions légales
        </h1>
        
        <div className="space-y-10 text-foreground/80 leading-relaxed">
          {/* Éditeur */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              1. Éditeur du site
            </h2>
            <p>
              <strong>Nom</strong> : La Virée d'Hector<br />
              <strong>Responsables</strong> : Sophie & Jean-Marc<br />
              <strong>Email</strong> : contact@lavireedhector.fr<br />
              <strong>Site web</strong> : https://lavireedhector.fr
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              2. Hébergement
            </h2>
            <p>
              <strong>Hébergeur</strong> : Vercel Inc.<br />
              <strong>Adresse</strong> : 440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
              <strong>Site web</strong> : https://vercel.com
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              3. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus de ce site (textes, images, vidéos, logos, 
              graphismes) est protégé par le droit d'auteur et le droit de la 
              propriété intellectuelle.
            </p>
            <p className="mt-3">
              Toute reproduction, représentation, modification, publication ou 
              adaptation de tout ou partie des éléments du site est interdite sans 
              autorisation écrite préalable de La Virée d'Hector.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              4. Cookies
            </h2>
            <p>
              <strong>Cookies utilisés sur ce site :</strong>
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>
                <strong>Cookies techniques</strong> (session, préférences) : 
                exemptés de consentement, nécessaires au fonctionnement du site
              </li>
              <li>
                <strong>Aucun cookie de tracking ou publicitaire</strong> n'est utilisé
              </li>
            </ul>
            <p className="mt-3">
              Pour plus d'informations, consultez notre{' '}
              <Link href="/politique-cookies" className="text-sunset hover:underline">
                Politique cookies
              </Link>.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              5. Responsabilité
            </h2>
            <p>
              La Virée d'Hector s'efforce de fournir des informations aussi précises 
              que possible. Toutefois, elle ne pourra être tenue responsable des 
              omissions, inexactitudes ou carences dans la mise à jour des informations.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              6. Contact
            </h2>
            <p>
              Pour toute question : <a href="mailto:contact@lavireedhector.fr" className="text-sunset hover:underline">contact@lavireedhector.fr</a>
            </p>
          </section>

          {/* Liens */}
          <div className="pt-8 border-t border-ink/10 flex flex-wrap gap-6 text-sm">
            <Link href="/politique-confidentialite" className="text-sunset hover:underline">
              Politique de confidentialité
            </Link>
            <Link href="/cgu" className="text-sunset hover:underline">
              CGU
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