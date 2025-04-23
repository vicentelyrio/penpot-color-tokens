import { DEFAULT_STEPS } from '@consts/config'
import { useState } from 'preact/hooks'

export function usePaletteOptions() {
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [tints, setTints] = useState(true)
  const [shades, setShades] = useState(true)

  return {
    steps,
    tints,
    shades,
    setSteps,
    setTints,
    setShades,
  }
}
