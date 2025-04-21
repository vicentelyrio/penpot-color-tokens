import isEqual from 'react-fast-compare'
import { useEffect, useState } from 'preact/hooks'

import { buildPalette } from '@utils/buildPalette'

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
    const newPalettes = palettes.reduce<Record<string, ColorToken>>((acc, palette) => {
      const baseColorIndex = palette.colors.findIndex(c => c === palette.color)
      let paletteObj: Record<string, ColorToken> = {}

      palette.colors.forEach((color, i) => {
        if (tints && shades) {
          if (i <= baseColorIndex) {
            const step = (i + 1) * 100
            const key = `${palette.name}-pale-${step}`
            paletteObj[key] = {
              $type: 'color',
              $value: color
            }
          }

          if (i >= baseColorIndex) {
            const step = (i - baseColorIndex + 1) * 100
            const key = `${palette.name}-shade-${step}`
            paletteObj[key] = {
              $type: 'color',
              $value: color
            }
          }
        } else {
          const step = (i + 1) * 100
          const key = `${palette.name}-${step}`
          paletteObj[key] = {
            $type: 'color',
            $value: color
          }
        }
      })

      return {
        ...acc,
        ...paletteObj
      }
    }, {})

    console.log(newPalettes)
  }

  return {
    steps,
    tints,
    shades,
    palettes,
    onAddPalette,
    onRemovePalette,
    onSetPalette,
    onSavePalettes,
    setSteps,
    setTints,
    setShades,
  }
}
