// data/rate-limit.ts

export const rateLimitData = {
  // ⭐ Textes de la page
  title: 'Trop de requêtes',
  subtitle: 'Hector a besoin d\'une pause.',
  description: 'Vous avez atteint la limite de requêtes autorisées. Revenez dans :',
  
  // ⭐ Boutons
  retryButton: 'Réessayer',
  retryButtonDisabled: 'Patientez...',
  homeButton: 'Accueil',
  
  // ⭐ Footer
  contactText: 'Si vous pensez qu\'il s\'agit d\'une erreur, contactez-nous à',
  contactEmail: 'contact@lavireedhector.fr',
  
  // ⭐ Metadata SEO
  metadata: {
    title: 'Trop de requêtes',
    description: 'Vous avez atteint la limite de requêtes. Réessayez plus tard.',
  },
  
  // ⭐ Configuration technique
  config: {
    durationMs: 60_000,      // 60 secondes
    localStorageKey: 'hector-rate-limit-start',
    cacheSeconds: 300,       // 5 minutes
  },
};