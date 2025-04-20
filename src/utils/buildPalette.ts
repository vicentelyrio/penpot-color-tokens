import { shade, tint } from '@utils/colors'

type UseColorsProps = {
  color: string
  steps: number
  tints: boolean
  shades: boolean
}

export function buildPalette({ color, steps, tints, shades }: UseColorsProps) {
  const stepsArray = Array.from(Array(steps).keys())
  const tintsArray = tints ? stepsArray.map((i) => tint(color, i, steps)).reverse() : []
  const shadesArray = shades ? stepsArray.map((i) => shade(color, i, steps)) : []

  return [...tintsArray, color, ...shadesArray]
}
