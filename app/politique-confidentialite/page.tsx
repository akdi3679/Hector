// app/politique-confidentialite/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité du site La Virée d\'Hector',
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-paper text-ink py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">
          Politique de confidentialité
        </h1>
        
        <div className="space-y-10 text-foreground/80 leading-relaxed">
          {/* Données collectées */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              1. Données collectées
            </h2>
            <p>
              Ce site ne collecte <strong>aucune donnée personnelle</strong>.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Aucun formulaire de contact</li>
              <li>Aucune inscription</li>
              <li>Aucun cookie de tracking</li>
              <li>Aucun outil d'analytics</li>
            </ul>
          </section>

          {/* Services tiers */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              2. Services tiers
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-ink">YouTube API</h3>
                <p className="mt-2">
                  Les données des chaînes YouTube (vidéos, statistiques) sont 
                  récupérées côté serveur uniquement. Aucune donnée utilisateur 
                  n'est transmise à YouTube depuis ce site.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">Cloudinary</h3>
                <p className="mt-2">
                  Service de stockage d'images. Aucune donnée personnelle n'est 
                  stockée sur Cloudinary.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">Vercel</h3>
                <p className="mt-2">
                  Hébergeur du site. Les logs serveur peuvent contenir des adresses 
                  IP, conservées maximum 30 jours pour des raisons de sécurité.
                </p>
              </div>
            </div>
          </section>

          {/* Droits RGPD */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              3. Vos droits (RGPD)
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), 
              vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="mt-3">
              Ce site ne collectant aucune donnée personnelle, ces droits sont 
              sans objet. Toutefois, pour toute question, contactez-nous.
            </p>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              4. Sécurité
            </h2>
            <p>
              Ce site utilise des mesures de sécurité standards :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>HTTPS obligatoire (HSTS)</li>
              <li>Content Security Policy (CSP)</li>
              <li>Rate limiting sur les APIs</li>
              <li>Headers de sécurité</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              5. Contact
            </h2>
            <p>
              Pour toute question sur la confidentialité :{' '}
              <a href="mailto:contact@lavireedhector.fr" className="text-sunset hover:underline">
                contact@lavireedhector.fr
              </a>
            </p>
          </section>

          {/* Liens */}
          <div className="pt-8 border-t border-ink/10 flex flex-wrap gap-6 text-sm">
            <Link href="/mentions-legales" className="text-sunset hover:underline">
              Mentions légales
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