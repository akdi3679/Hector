// lib/useGlobalFetch.ts
"use client";
import { useEffect } from 'react';
import { useToast } from '@/components/Toast';

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

export function useGlobalFetch() {
  const { toast } = useToast();

  useEffect(() => {
    // ⭐ Intercepte les erreurs réseau globales (fetch + XHR)
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

    // ⭐ Détection offline/online
    const handleOffline = () => {
      toast(ERROR_MESSAGES.offline, 'error', 0); // Durée 0 = pas d'auto-close
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