import { useCallback, useEffect, useState } from 'preact/hooks'

import { parseColors } from '@utils/parseColors'
import { downloadJsonFile } from '@utils/downloadJson'

import { MESSAGES } from '@consts/messages'

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
  const [errors, setErrors] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [generationResult, setGenerationResult] = useState<null | GenerationResult>(null)
  const [exportResult, setExportResult] = useState<null | ExportResult>(null)

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

      setIsGenerating(false)

      setGenerationResult({
        success,
        message,
        stats,
        results
      })
    }

    if (data.type === MESSAGES.JSON_GENERATED) {
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

    if (data.type === MESSAGES.COMPONENTS_GENERATED) {
      setIsCreating(false)

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
    setIsExporting,
    setIsCreating
  ])

  useEffect(() => {
    window.addEventListener('message', onMessageReturn)

    return () => {
      window.removeEventListener('message', onMessageReturn)
    }
  }, [])

  useEffect(() => {
    const list = Object.values(palettes).map(({ name }) => name)
    const errorIndexes = list.reduce((acc, name, index) => {
      if (!name || list.indexOf(name) != index) acc.push(index)
      return acc
    }, [] as number[])
    setErrors(errorIndexes)
  }, [palettes])

  function onGeneratePalettes() {
    const tokenData = parseColors(palettes, tints, shades, delimiter)

    if (libraryMode) {
      setIsGenerating(true)
      setGenerationResult(null)

      parent.postMessage({
        type: MESSAGES.GENERATE_COLOR_LIBRARY,
        tokens: tokenData
      }, '*')
    }

    if (jsonMode) {
      setIsExporting(true)
      setExportResult(null)

      parent.postMessage({
        type: MESSAGES.GENERATE_JSON,
        tokens: tokenData
      }, '*')
    }

    if (visualPaletteMode) {
      setIsCreating(true)
      setGenerationResult(null)

      parent.postMessage({
        type: MESSAGES.GENERATE_COMPONENTS,
        tokens: tokenData
      }, '*')
    }
  }

  return {
    isGenerating,
    isExporting,
    isCreating,
    errors,
    generationResult,
    exportResult,
    onGeneratePalettes,
  }
}
