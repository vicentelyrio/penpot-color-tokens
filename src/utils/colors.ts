import { RGBA } from '@skinnypete/color'

export function tint(color: string, step: number, total: number) {
  const rgbaColor = RGBA.fromHex(color)
  const lightEndpoint = RGBA.fromRGBA(248, 249, 250, 1)

  const rawPercentage = (step + 1) / (total + 1)
  const maxMix = 0.85
  const easedPercentage = Math.pow(rawPercentage, 0.8) * maxMix

  return rgbaColor.mix(lightEndpoint.toObject(), easedPercentage).toHexString()
}

export function shade(color: string, step: number, total: number) {
  const rgbaColor = RGBA.fromHex(color)
  const { red, green, blue } = rgbaColor.toObject()

  const rawPercentage = (step + 1) / (total + 1)
  const maxDarken = 0.75
  const easedPercentage = Math.pow(rawPercentage, 0.9) * maxDarken

  const newRed = Math.max(0, Math.round(red * (1 - easedPercentage)))
  const newGreen = Math.max(0, Math.round(green * (1 - easedPercentage)))
  const newBlue = Math.max(0, Math.round(blue * (1 - easedPercentage)))

  const r = newRed.toString(16).padStart(2, '0')
  const g = newGreen.toString(16).padStart(2, '0')
  const b = newBlue.toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}
