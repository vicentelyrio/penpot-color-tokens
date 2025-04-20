import { useMemo } from 'preact/hooks'
import { shade, tint } from '@utils/colors'

type UseColorsProps = {
  color: string
  steps: number
  tints: boolean
  shades: boolean
}

export function useColors({ color, steps, tints, shades }: UseColorsProps) {
  const stepsArray = useMemo(() => Array.from(Array(steps).keys()), [steps])

  const tintsArray = useMemo(() => (
    tints ? stepsArray.map((i) => tint(color, i, steps)).reverse() : []
  ), [steps, color, tints])

  const shadesArray = useMemo(() => (
    shades ? stepsArray.map((i) => shade(color, i, steps)) : []
  ), [steps, color, shades])

  return {
    colors: [...tintsArray, color, ...shadesArray],
  }
}
