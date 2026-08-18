// app/not-found.tsx
"use client"; 

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="fr">
      <body className="bg-paper font-sans text-ink antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <div className="text-center">
            <h1 className="font-display text-[120px] font-bold leading-none text-sun md:text-[180px]">
              404
            </h1>
            <p className="hand mt-4 text-4xl text-sunset">page introuvable</p>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-mist">
              Cette route n'existe pas ou a été déplacée. Hector a dû prendre un mauvais virage.
            </p>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="btn btn-ink inline-flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Retour à l'accueil
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn btn-ghost inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Page précédente
              </button>
            </div>
          </div>
          
          {/* Animation décorative */}
          <div className="roadline mt-16 w-full max-w-md" />
        </main>
      </body>
    </html>
  );
}