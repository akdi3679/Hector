// lib/useToastApi.ts
"use client";
import { useEffect } from 'react';
import { useToast } from '@/components/Toast';

// ⭐ Messages FR uniquement
const ERROR_MESSAGES: Record<string, string> = {
  // HTTP Status
  '429': 'Trop de requêtes. Veuillez réessayer dans une minute.',
  '400': 'Requête invalide.',
  '401': 'Accès non autorisé.',
  '403': 'Accès refusé.',
  '404': 'Ressource introuvable.',
  '500': 'Erreur serveur. Veuillez réessayer plus tard.',
  '502': 'Service temporairement indisponible.',
  '503': 'Service en maintenance. Réessayez plus tard.',
  '504': 'Délai d\'attente dépassé. Réessayez plus tard.',

  // Erreurs API spécifiques
  'too_many_requests': 'Trop de requêtes. Veuillez réessayer dans une minute.',
  'not_found': 'Ressource temporairement indisponible. Réessayez plus tard.',
  'config_error': 'Erreur de configuration.',
  'server_error': 'Erreur serveur. Veuillez réessayer plus tard.',
  'invalid_key': 'Requête invalide.',
  'network_error': 'Problème de connexion. Vérifiez votre réseau.',
  'offline': 'Vous êtes hors ligne. Vérifiez votre connexion.',
  'timeout': 'La requête a expiré. Réessayez plus tard.',
};

// ⭐ Hook 1 : Interception globale des erreurs réseau
export function useGlobalFetch() {
  const { toast } = useToast();

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      if (reason?.message?.includes('Failed to fetch')) {
        toast(ERROR_MESSAGES.network_error, 'error');
        event.preventDefault();
        return;
      }

      if (reason?.name === 'AbortError') {
        toast(ERROR_MESSAGES.timeout, 'warning');
        event.preventDefault();
        return;
      }
    };

    const handleOffline = () => {
      toast(ERROR_MESSAGES.offline, 'error', 0);
    };

    const handleOnline = () => {
      toast('Connexion rétablie.', 'success', 3000);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [toast]);
}

// ⭐ Hook 2 : Fetch manuel avec toast (pour media kit, etc.)

export function useApiFetch() {
  const { toast } = useToast();

  const fetchWithToast = async (
    url: string,
    options: RequestInit = {},
    successMessage?: string // ⭐ Nouveau paramètre optionnel
  ) => {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'unknown' }));
        const errorCode = errData.error as keyof typeof ERROR_MESSAGES;

        let message: string;
        if (errorCode && ERROR_MESSAGES[errorCode]) {
          message = ERROR_MESSAGES[errorCode];
        } else if (res.status === 429) {
          message = ERROR_MESSAGES['429'];
        } else {
          message = ERROR_MESSAGES['500'];
        }

        const type = res.status === 429 ? 'warning' : 'error';
        const duration = res.status === 429 ? 8000 : 5000;
        toast(message, type, duration);

        return { ok: false, status: res.status, data: errData };
      }

      // ⭐ Toast succès si message fourni
      if (successMessage) {
        toast(successMessage, 'success', 3000);
      }

      const data = await res.json().catch(() => null);
      return { ok: true, status: res.status, data };
    } catch (err) {
      toast(ERROR_MESSAGES.network_error, 'error');
      return { ok: false, status: 0, data: null };
    }
  };

  return fetchWithToast;
}