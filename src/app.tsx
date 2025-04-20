import { useEffect, useState } from 'preact/hooks'

import { buildPalette } from '@utils/buildPalette'
import { Actions } from '@components/actions/actions'
import { Colors } from '@components/colors/colors'
import isEqual from 'react-fast-compare'

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

export function App() {
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
    const newPalettes = palettes.reduce((acc, palette) => {
      const paletteObj = palette.colors.reduce((colorAcc, color, i) => {
        const step = (i + 1) * 100
        let key = `${palette.name}-${step}`

        if (tints && shades) {
          const isTint = tints && i <= steps
          key = `${palette.name}-${isTint ? 'tint' : 'shade'}-${step}`
        }

        return {
          ...colorAcc,
          [key]: {
            $type: 'color',
            $value: color
          }
        }
      }, {})
      return {
        ...acc,
        ...paletteObj
      }
    }, {})
  }

  return (
    <div>
      <Actions
        tints={tints}
        shades={shades}
        steps={steps}
        setTints={setTints}
        setShades={setShades}
        setSteps={setSteps}
        onAddPalette={onAddPalette}
        onSavePalettes={onSavePalettes}
      />

      <Colors
        palettes={palettes}
        onSetPalette={onSetPalette}
      />
    </div>
  )
}
