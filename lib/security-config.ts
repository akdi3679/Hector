// lib/security-config.ts
// Server-side security config.
// Used by middleware only.

export const ALLOWED_ORIGINS: string[] = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const CLIENT_API_KEY =
  process.env.CLIENT_API_KEY || 'hector-web-2026-secret';

export const CLIENT_API_HEADER =
  process.env.NEXT_PUBLIC_API_KEY_HEADER || 'X-Hector-Client';

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

export function isValidClientKey(headerValue: string | null): boolean {
  return headerValue === CLIENT_API_KEY;
}