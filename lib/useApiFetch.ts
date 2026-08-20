// lib/useApiFetch.ts
"use client";
import { useToast } from '@/components/Toast';

// ⭐ Messages FR uniquement
const ERROR_MESSAGES = {
  429: 'Trop de requêtes. Veuillez réessayer dans une minute.',
  400: 'Requête invalide. Veuillez vérifier votre saisie.',
  404: 'Ressource introuvable.',
  500: 'Erreur serveur. Veuillez réessayer plus tard.',
  network: 'Problème de connexion. Vérifiez votre réseau.',
  not_found: 'Le media kit est temporairement indisponible. Réessayez plus tard.',
  too_many_requests: 'Trop de requêtes. Veuillez réessayer dans une minute.',
  config_error: 'Erreur de configuration. Contactez le support.',
  server_error: 'Erreur serveur. Veuillez réessayer plus tard.',
};

export function useApiFetch() {
  const { toast } = useToast();

  const fetchWithToast = async (
    url: string,
    options: RequestInit = {}
  ) => {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'unknown' }));
        const errorCode = errData.error as keyof typeof ERROR_MESSAGES;

        // ⭐ Message spécifique selon le type d'erreur
        let message: string;
        if (errorCode && ERROR_MESSAGES[errorCode]) {
          message = ERROR_MESSAGES[errorCode];
        } else if (res.status === 429) {
          message = ERROR_MESSAGES[429];
        } else if (res.status === 400) {
          message = ERROR_MESSAGES[400];
        } else if (res.status === 404) {
          message = ERROR_MESSAGES[404];
        } else {
          message = ERROR_MESSAGES[500];
        }

        // ⭐ Type de toast selon la gravité
        const type = res.status === 429 ? 'warning' : 'error';
        const duration = res.status === 429 ? 8000 : 5000;

        toast(message, type, duration);
        return { ok: false, status: res.status, data: errData };
      }

      // ⭐ Succès silencieux (pas de toast pour les opérations normales)
      const data = await res.json().catch(() => null);
      return { ok: true, status: res.status, data };
    } catch (err) {
      console.error('[api] Network error:', err);
      toast(ERROR_MESSAGES.network, 'error');
      return { ok: false, status: 0, data: null };
    }
  };

  return fetchWithToast;
}