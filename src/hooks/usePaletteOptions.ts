import { DEFAULT_STEPS } from '@consts/config'
import { useState } from 'preact/hooks'

export function usePaletteOptions() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [tints, setTints] = useState(true)
  const [shades, setShades] = useState(true)
  const [colorType, setColorType] = useState<ColorType>('segment')

  return {
    steps,
    tints,
    shades,
    colorType,
    setSteps,
    setTints,
    setShades,
    setColorType,
  }
}
