// app/global-error.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error - Critical]', error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f7f1e5', color: '#16294a' }}>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px' }}>
              Erreur critique
            </h1>
            <p style={{ fontSize: '18px', color: '#5d6f8d', marginBottom: '32px' }}>
              Le site rencontre un problème majeur. Réessayez dans quelques instants.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#16294a',
                color: '#f7f1e5',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}