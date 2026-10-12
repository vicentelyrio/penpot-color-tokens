import type { TokenCatalog } from '@penpot/plugin-types'

export function isTokenApiAvailable(): boolean {
  const local = penpot.library?.local as unknown as { tokens?: TokenCatalog } | undefined
  return !!local?.tokens
}

export function getTokenCatalog(): TokenCatalog {
  if (!isTokenApiAvailable()) {
    throw new Error('Tokens API not available (requires Penpot 2.14+)')
  }
  return (penpot.library.local as unknown as { tokens: TokenCatalog }).tokens
}
