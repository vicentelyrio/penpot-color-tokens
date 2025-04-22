import isEqual from 'react-fast-compare'
import { useEffect, useState } from 'preact/hooks'

import { buildPalette } from '@utils/buildPalette'
import { parseColors } from '@utils/parseColors'
import { MESSAGES } from '@consts/messages'

const DEFAULT_STEPS = 8
const DEFAULT_PALETTE_COLOR = '#666666'
const DEFAULT_PALETTE_NAME = 'gray'

const defaultPalette = {
  name: DEFAULT_PALETTE_NAME,
  color: DEFAULT_PALETTE_COLOR,
  colors: buildPalette({
    color: DEFAULT_PALETTE_COLOR,
    steps: DEFAULT_STEPS,
    tints: true,
    shades: true
  })
}

export function useAppState() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [tints, setTints] = useState(true)
  const [shades, setShades] = useState(true)
  const [palettes, setPalettes] = useState<Palette[]>([defaultPalette])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<null | GenerationResult>(null)

  useEffect(() => {
    const newPalettes = palettes.map((palette) => ({
      ...palette,
      colors: buildPalette({
        color: palette.color,
        steps,
        tints,
        shades
      })
    }))

    if (!isEqual(newPalettes, palettes)) {
      setPalettes(newPalettes)
    }
  }, [steps, tints, shades, palettes])

  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      if (data.type === 'palettesGenerated') {
        setIsGenerating(false)

        const { results, success, message } = data

        let stats

        if (results && Array.isArray(results)) {
          const created = results.filter((result: ResultItem) => result.success && !result.skipped).length
          const skipped = results.filter((result: ResultItem) => result.success && result.skipped).length
          const failed = results.filter((result: ResultItem) => !result.success).length

          stats = { created, skipped, failed }
        }

        setGenerationResult({
          success,
          message,
          stats,
          results
        })
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  function onAddPalette() {
    setPalettes([...palettes, defaultPalette])
  }

  function onRemovePalette(index: number) {
    const remainingPalettes = palettes.filter((_, i) => i !== index)
    setPalettes(remainingPalettes)
  }

  function onSetPalette(color: string, name: string, index: number) {
    const newPalettes = palettes.map((palette, i) => {
      if (i !== index) return palette

      return {
        color,
        name,
        colors: buildPalette({
          color,
          steps,
          tints,
          shades
        })
      }
    })

    setPalettes(newPalettes)
  }

  function onSavePalettes() {
    setIsGenerating(true)
    setGenerationResult(null)

    parent.postMessage({
      type: MESSAGES.SAVE_PALETTES,
      tokens: parseColors(palettes, tints, shades)
    }, '*')
  }

  return {
    steps,
    tints,
    shades,
    palettes,
    isGenerating,
    generationResult,
    onAddPalette,
    onRemovePalette,
    onSetPalette,
    onSavePalettes,
    setSteps,
    setTints,
    setShades,
  }
}
