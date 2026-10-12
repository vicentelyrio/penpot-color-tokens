import type { TokenSet } from '@penpot/plugin-types'

import { getTokenCatalog, isTokenApiAvailable } from '@plugin/tokenService'
import { LIBRARY_NAME } from '@consts/config'

export function getTokenSets(): TokenSetsResult {
  if (!isTokenApiAvailable()) {
    return { available: false, sets: [] }
  }

  const sets = getTokenCatalog().sets.map(({ id, name, active }) => ({ id, name, active }))
  return { available: true, sets }
}

function resolveSet(setId: string | null | undefined, newSetName?: string): TokenSet {
  const catalog = getTokenCatalog()

  if (setId) {
    const set = catalog.getSetById(setId)
    if (!set) throw new Error('Selected token set no longer exists')
    return set
  }

  const name = (newSetName || LIBRARY_NAME).trim()
  if (!name) throw new Error('Token set name is empty')

  // New sets are inactive by default; activate so the tokens actually apply
  return catalog.sets.find((set) => set.name === name) ?? catalog.addSet({ name, active: true })
}

const normalize = (value: unknown) => String(value).trim().toLowerCase()

export async function generateTokens(
  tokenColors: Record<string, ColorToken>,
  setId?: string | null,
  newSetName?: string
): Promise<GenerationResult> {
  const colors = Object.entries(tokenColors).filter(([_, data]) => data.$type === 'color')

  if (colors.length === 0) {
    return {
      success: false,
      message: 'No valid colors found in the tokens data'
    }
  }

  try {
    const set = resolveSet(setId, newSetName)
    const existing = new Map(set.tokens.map((token) => [token.name, token]))

    const results: ResultItem[] = colors.map(([name, { $value }]) => {
      try {
        const token = existing.get(name)

        if (!token) {
          set.addToken({ type: 'color', name, value: $value })
          return { name, success: true }
        }

        if (token.type !== 'color') {
          return {
            name,
            success: false,
            error: `Existing token has type "${token.type}", not "color"`
          }
        }

        if (normalize(token.value) === normalize($value)) {
          return { name, success: true, skipped: true, message: 'Value unchanged' }
        }

        token.value = $value
        return { name, success: true, updated: true }
      }
      catch (error) {
        return { name, success: false, error: (error as Error)?.message }
      }
    })

    return {
      success: true,
      message: `Processed ${colors.length} tokens in set "${set.name}".`,
      results
    }
  }
  catch (error) {
    return {
      success: false,
      message: 'Error accessing Penpot API: ' + (error as Error).message
    }
  }
}
