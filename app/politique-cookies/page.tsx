// app/politique-cookies/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique cookies',
  description: 'Politique cookies du site La Virée d\'Hector',
};

export default function PolitiqueCookies() {
  return (
    <div className="min-h-screen bg-paper text-ink py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-12">
          Politique cookies
        </h1>
        
        <div className="space-y-10 text-foreground/80 leading-relaxed">
          {/* Qu'est-ce qu'un cookie */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre appareil 
              (ordinateur, tablette, smartphone) lors de la visite d'un site web.
            </p>
          </section>

          {/* Cookies utilisés */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              2. Cookies utilisés sur ce site
            </h2>
            
            <div className="bg-sun/10 rounded-lg p-6 border border-sun/20">
              <h3 className="font-semibold text-ink mb-3">
                ✅ Cookies techniques (exemptés de consentement)
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Cookies de session</strong> : nécessaires au fonctionnement 
                  du site, supprimés à la fermeture du navigateur
                </li>
                <li>
                  <strong>Cookies de préférences</strong> : mémorisent vos choix 
                  (langue, thème)
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200 mt-4">
              <h3 className="font-semibold text-green-800 mb-3">
                🎉 Aucun cookie de tracking
              </h3>
              <p>
                Ce site n'utilise <strong>aucun cookie de tracking ou publicitaire</strong> :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Pas de Google Analytics</li>
                <li>Pas de Facebook Pixel</li>
                <li>Pas de cookies publicitaires</li>
                <li>Pas de cookies de mesure d'audience tiers</li>
              </ul>
            </div>
          </section>

          {/* Gestion des cookies */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              3. Gestion des cookies
            </h2>
            <p>
              Vous pouvez configurer votre navigateur pour accepter ou refuser 
              les cookies. Voici comment faire selon votre navigateur :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>
                <strong>Chrome</strong> : Paramètres → Confidentialité et sécurité → Cookies
              </li>
              <li>
                <strong>Firefox</strong> : Options → Vie privée et sécurité → Cookies
              </li>
              <li>
                <strong>Safari</strong> : Préférences → Confidentialité → Cookies
              </li>
              <li>
                <strong>Edge</strong> : Paramètres → Cookies et autorisations de site
              </li>
            </ul>
            <p className="mt-3">
              ⚠️ Attention : la désactivation des cookies techniques peut empêcher 
              le bon fonctionnement du site.
            </p>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              4. Durée de conservation
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Cookies de session : supprimés à la fermeture du navigateur</li>
              <li>Cookies de préférences : 12 mois maximum</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 text-ink">
              5. Contact
            </h2>
            <p>
              Pour toute question sur les cookies :{' '}
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
            <Link href="/politique-confidentialite" className="text-sunset hover:underline">
              Politique de confidentialité
            </Link>
            <Link href="/cgu" className="text-sunset hover:underline">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}