import { useCallback, useEffect, useState } from 'preact/hooks'

import { parseColors } from '@utils/parseColors'
import { downloadJsonFile } from '@utils/downloadJson'

import { MESSAGES } from '@consts/messages'
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
}

export function useGenerate({
  palettes,
  shades,
  tints,
  jsonMode,
  delimiter,
  libraryMode,
  visualPaletteMode
}: UseGenerateProps) {
  const [errors, setErrors] = useState<Record<string, number[]>>({})
  const [status, setStatus] = useState<ToastProps[]>([])

  const onMessageReturn = useCallback(({ data }: MessageEvent) => {
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
            duration: TOAST_DURATION,
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
            duration: TOAST_DURATION,
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
            duration: TOAST_DURATION,
          }
        ]
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', onMessageReturn)

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
  }

  return {
    errors,
    status,
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
