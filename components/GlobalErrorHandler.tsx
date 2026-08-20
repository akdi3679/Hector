// components/GlobalErrorHandler.tsx
"use client";

import { useGlobalFetch } from "@/lib/useToastApi";

/**
 * Composant client qui active l'interception globale des erreurs.
 * Doit être rendu dans le layout pour fonctionner sur toutes les pages.
 */
export default function GlobalErrorHandler() {
  useGlobalFetch();
  return null;
}