import isEqual from 'react-fast-compare'
import { useEffect, useState } from 'preact/hooks'

import { buildPalette } from '@utils/buildPalette'

import {
  DEFAULT_PALETTE_COLOR,
  DEFAULT_PALETTE_NAME,
  DEFAULT_STEPS
} from '@consts/config'

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

export type UsePaletteProps = {
  steps: number
  tints: boolean
  shades: boolean
}

export function usePalette({ steps, tints, shades }: UsePaletteProps) {
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

  return {
    palettes,
    onAddPalette,
    onRemovePalette,
    onSetPalette,
  }
}
