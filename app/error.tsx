// app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur (en production, envoyer à un service comme Sentry)
    console.error('[Global Error]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-paper font-sans text-ink antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sunset/10">
              <AlertTriangle className="h-10 w-10 text-sunset" />
            </div>
            
            <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
              Une erreur est survenue
            </h1>
            <p className="hand mt-4 text-3xl text-sunset">oups, ça coince</p>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-mist">
              Quelque chose s'est mal passé. Hector est en train de vérifier le moteur.
            </p>
            
            {/* Message technique (dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mx-auto mt-6 max-w-md rounded-lg border border-ink/10 bg-paper/50 p-4 text-left">
                <summary className="cursor-pointer font-semibold text-ink">
                  Détails techniques
                </summary>
                <pre className="mt-3 overflow-x-auto text-xs text-mist">
                  {error.message}
                  {'\n\n'}
                  {error.digest && `Digest: ${error.digest}`}
                </pre>
              </details>
            )}
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="btn btn-ink inline-flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Réessayer
              </button>
              <a href="/" className="btn btn-ghost inline-flex items-center justify-center gap-2">
                <Home size={18} />
                Accueil
              </a>
            </div>
          </div>
          
          <div className="roadline mt-16 w-full max-w-md" />
        </main>
      </body>
    </html>
  );
}