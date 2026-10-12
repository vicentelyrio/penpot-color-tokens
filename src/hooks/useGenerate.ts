import { useCallback, useEffect, useState } from 'preact/hooks'

import { parseColors } from '@utils/parseColors'
import { downloadJsonFile } from '@utils/downloadJson'

import { MESSAGES } from '@consts/messages'
import { NEW_TOKEN_SET } from '@consts/config'
import { ToastProps } from '@components/toaster/toaster'
const TOAST_DURATION = 5000

export type UseGenerateProps = {
  palettes: Palette[]
  shades: boolean
  tints: boolean
  delimiter: Delimiter
  jsonMode: boolean
  libraryMode: boolean
  visualPaletteMode: boolean
  tokensMode?: boolean
  targetSet?: string
  newSetName?: string
}

export function useGenerate({
  palettes,
  shades,
  tints,
  jsonMode,
  delimiter,
  libraryMode,
  visualPaletteMode,
  tokensMode = false,
  targetSet = '',
  newSetName = ''
}: UseGenerateProps) {
  const [errors, setErrors] = useState<Record<string, number[]>>({})
  const [status, setStatus] = useState<ToastProps[]>([])
  const [tokenSets, setTokenSets] = useState<TokenSetsResult>({ available: false, sets: [] })

  const requestTokenSets = useCallback(() => {
    parent.postMessage({ type: MESSAGES.GET_TOKEN_SETS }, '*')
  }, [])

  const onMessageReturn = useCallback(({ data }: MessageEvent) => {
    if (data.type === MESSAGES.TOKEN_SETS) {
      setTokenSets({ available: !!data.available, sets: data.sets ?? [] })
    }

    if (data.type === MESSAGES.TOKENS_GENERATED) {
      const { results, success, message } = data
      const stats = { created: 0, updated: 0, skipped: 0, failed: 0 }

      if (results && Array.isArray(results)) {
        stats.created = results.filter((r: ResultItem) => r.success && !r.skipped && !r.updated).length
        stats.updated = results.filter((r: ResultItem) => r.success && r.updated).length
        stats.skipped = results.filter((r: ResultItem) => r.success && r.skipped).length
        stats.failed = results.filter((r: ResultItem) => !r.success).length
      }

      setStatus((status) => [
        ...status,
        {
          id: MESSAGES.GENERATE_TOKENS,
          message,
          type: (!success || stats.failed) ? 'error' : 'success',
          duration: TOAST_DURATION * 10,
          stats
        }
      ])

      // A new set may have been created
      requestTokenSets()
    }

    if (data.type === MESSAGES.COLOR_LIBRARY_GENERATED) {
      const { results, success, message } = data
      const stats = { created: 0, skipped: 0, failed: 0 }

      if (results && Array.isArray(results)) {
        const created = results.filter(({ success, skipped }) => !!success && !skipped).length
        const skipped = results.filter(({ success, skipped }) => !!success && skipped).length
        const failed = results.filter(({ success }) => !success).length

        Object.assign(stats, { created, skipped, failed })
      }

      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_COLOR_LIBRARY,
            message,
            type: (!success || stats.failed) ? 'error' : (stats.skipped ? 'warning' : 'success'),
            duration: TOAST_DURATION * 10,
            stats
          }
        ]
      })
    }

    if (data.type === MESSAGES.JSON_GENERATED) {
      const { success, message, jsonData } = data

      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_JSON,
            message,
            type: success ? 'success' : 'error',
            duration: TOAST_DURATION * 10,
          }
        ]
      })

      if (success && jsonData) {
        downloadJsonFile(jsonData)
      }
    }

    if (data.type === MESSAGES.COMPONENTS_GENERATED) {
      const { success, message } = data

      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_COMPONENTS,
            message,
            type: success ? 'success' : 'error',
            duration: TOAST_DURATION * 10,
          }
        ]
      })
    }
  }, [requestTokenSets])

  useEffect(() => {
    window.addEventListener('message', onMessageReturn)
    requestTokenSets()

    return () => {
      window.removeEventListener('message', onMessageReturn)
    }
  }, [])

  useEffect(() => {
    const errors: Record<string, number[]> = {}

    const nameErrors = extractErrors(palettes, 'name')
    if (nameErrors.length > 0) errors['name'] = nameErrors

    const colorErrors = extractErrors(palettes, 'color')
    if (colorErrors.length > 0) errors['color'] = colorErrors

    setErrors(errors)
  }, [palettes])

  function onGeneratePalettes() {
    const tokenData = parseColors(palettes, tints, shades, delimiter)
    setStatus([])

    if (libraryMode) {
      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_COLOR_LIBRARY,
            message: 'Creating Color Library',
            type: 'loading',
            duration: TOAST_DURATION,
          }
        ]
      })

      parent.postMessage({
        type: MESSAGES.GENERATE_COLOR_LIBRARY,
        tokens: tokenData
      }, '*')
    }

    if (jsonMode) {
      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_JSON,
            message: 'Creating JSON Tokens',
            type: 'loading',
            duration: TOAST_DURATION,
          }
        ]
      })

      parent.postMessage({
        type: MESSAGES.GENERATE_JSON,
        tokens: tokenData
      }, '*')
    }

    if (visualPaletteMode) {
      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_COMPONENTS,
            message: 'Creating Color Palettes',
            type: 'loading',
            duration: TOAST_DURATION,
          }
        ]
      })

      parent.postMessage({
        type: MESSAGES.GENERATE_COMPONENTS,
        tokens: tokenData
      }, '*')
    }

    if (tokensMode) {
      setStatus((status) => {
        return [
          ...status,
          {
            id: MESSAGES.GENERATE_TOKENS,
            message: 'Adding to Tokens',
            type: 'loading',
            duration: TOAST_DURATION,
          }
        ]
      })

      const isNewSet = targetSet === NEW_TOKEN_SET

      parent.postMessage({
        type: MESSAGES.GENERATE_TOKENS,
        tokens: tokenData,
        setId: isNewSet ? null : targetSet,
        newSetName: isNewSet ? newSetName : undefined
      }, '*')
    }
  }

  return {
    errors,
    status,
    tokenSets,
    onGeneratePalettes,
  }
}

function extractErrors(palettes: Palette[], key: keyof Palette) {
  const mapped = palettes.map((palette) => palette[key])
  return mapped.reduce((acc, current, index) => {
    if (!current || mapped.indexOf(current) != index) acc.push(index)
    return acc
  }, [] as number[])
}
