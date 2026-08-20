// lib/api-client.ts
'use client';

// Client-side API config.
// Used by useMedia, useToastApi, site-data.

export const API_KEY_HEADER =
  process.env.NEXT_PUBLIC_API_KEY_HEADER || 'X-Hector-Client';

export const API_KEY_VALUE =
  process.env.NEXT_PUBLIC_CLIENT_API_KEY || 'hector-web-2026-secret';

export function getApiClientKey(): string {
  return API_KEY_VALUE;
}

export function getApiHeaders(): HeadersInit {
  return {
    [API_KEY_HEADER]: API_KEY_VALUE,
  };
}