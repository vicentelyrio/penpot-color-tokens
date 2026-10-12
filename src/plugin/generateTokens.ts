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

const REFRESH_PAUSE_MS = 50

// The tokens API has no refresh call. Penpot re-resolves tokens when a set is
// (de)activated, so briefly switch an active set off and on again.
async function reactivateSet(set: TokenSet): Promise<boolean> {
  if (!set.active) return false

  set.active = false
  try {
    if (typeof setTimeout === 'function') {
      await new Promise((resolve) => setTimeout(resolve, REFRESH_PAUSE_MS))
    }
  }
  finally {
    // Never leave the user's set switched off
    set.active = true
  }

  return true
}

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

    const hasChanges = results.some(({ success, skipped }) => success && !skipped)
    let refreshed = false

    if (hasChanges) {
      try {
        refreshed = await reactivateSet(set)
      }
      catch {
        // Values are written; a failed refresh must not turn the run into an error
      }
    }

    return {
      success: true,
      message: `Processed ${colors.length} tokens in set "${set.name}".` +
        (refreshed ? ' Set re-activated to apply the new values.' : ''),
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
