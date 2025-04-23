import { useCallback, useEffect, useState } from 'preact/hooks'

import { parseColors } from '@utils/parseColors'
import { downloadJsonFile } from '@utils/downloadJson'

import { MESSAGES } from '@consts/messages'

export type UseGenerateProps = {
  palettes: Palette[]
  shades: boolean
  tints: boolean
  jsonMode: boolean
  libraryMode: boolean
  visualPaletteMode: boolean
}

export function useGenerate({
  palettes,
  shades,
  tints,
  jsonMode,
  libraryMode,
  visualPaletteMode
}: UseGenerateProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [generationResult, setGenerationResult] = useState<null | GenerationResult>(null)
  const [exportResult, setExportResult] = useState<null | ExportResult>(null)

  const onMessageReturn = useCallback(({ data }: MessageEvent) => {
    if (data.type === MESSAGES.PALETTE_GENERATED) {
      const { results, success, message } = data
      const stats = { created: 0, skipped: 0, failed: 0 }

      if (results && Array.isArray(results)) {
        const created = results.filter(({ success, skipped }) => !!success && !skipped).length
        const skipped = results.filter(({ success, skipped }) => !!success && skipped).length
        const failed = results.filter(({ success }) => !success).length

        Object.assign(stats, { created, skipped, failed })
      }

      setIsGenerating(false)

      setGenerationResult({
        success,
        message,
        stats,
        results
      })
    }

    if (data.type === MESSAGES.JSON_EXPORTED) {
      setIsExporting(false)

      const { success, message, jsonData } = data

      setExportResult({
        success,
        message,
        result: jsonData
      })

      if (success && jsonData) {
        downloadJsonFile(jsonData)
      }
    }

    if (data.type === MESSAGES.VISUAL_PALETTE_GENERATED) {
      setIsGenerating(false)

      const { success, message } = data

      setGenerationResult({
        success,
        message,
        stats: undefined,
        results: []
      })
    }
  }, [
    setIsGenerating,
    setGenerationResult,
    setExportResult,
    setGenerationResult,
    setIsExporting
  ])

  useEffect(() => {
    window.addEventListener('message', onMessageReturn)

    return () => {
      window.removeEventListener('message', onMessageReturn)
    }
  }, [])

  function onGeneratePalettes() {
    const tokenData = parseColors(palettes, tints, shades)

    if (libraryMode) {
      setIsGenerating(true)
      setGenerationResult(null)

      parent.postMessage({
        type: MESSAGES.SAVE_PALETTES,
        tokens: tokenData
      }, '*')
    }

    if (jsonMode) {
      setIsExporting(true)
      setExportResult(null)

      parent.postMessage({
        type: MESSAGES.EXPORT_AS_JSON,
        tokens: tokenData
      }, '*')
    }

    if (visualPaletteMode) {
      setIsGenerating(true)
      setGenerationResult(null)

      parent.postMessage({
        type: MESSAGES.GENERATE_VISUAL_PALETTE,
        tokens: tokenData
      }, '*')
    }
  }

  return {
    isGenerating,
    isExporting,
    generationResult,
    exportResult,
    onGeneratePalettes,
  }
}
