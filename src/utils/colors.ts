import { RGBA } from '@skinnypete/color'

export function tint(color: string, step: number, total: number) {
  const rgbaColor = RGBA.fromHex(color)
  const white = RGBA.fromRGBA(255, 255, 255, 1)
  const percentage = (step + 1) / (total + 1)
  return rgbaColor.mix(white.toObject(), percentage).toHexString()
}

export function shade(color: string, step: number, total: number) {
  const rgbaColor = RGBA.fromHex(color)
  const { red, green, blue } = rgbaColor.toObject()

  const percentage = (step + 1) / (total + 1)
  const newRed = Math.max(0, Math.round(red * (1 - percentage)))
  const newGreen = Math.max(0, Math.round(green * (1 - percentage)))
  const newBlue = Math.max(0, Math.round(blue * (1 - percentage)))

  const r = newRed.toString(16).padStart(2, '0')
  const g = newGreen.toString(16).padStart(2, '0')
  const b = newBlue.toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}
