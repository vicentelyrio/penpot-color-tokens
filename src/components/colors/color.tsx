import { useMemo, useState } from 'preact/hooks'

import { clsx } from '@utils/clsx'
import { shade, tint } from '@utils/colors'

import classes from './colors.module.css'

const DEFAULT_COLOR = '#666666'
const DEFAULT_COLOR_NAME = 'gray'

export type ColorProps = {
  steps: number
  tints: boolean
  shades: boolean
}

export function Color({ steps, tints, shades }: ColorProps) {
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [name, setName] = useState(DEFAULT_COLOR_NAME)

  const colors = useColors({ color, steps, tints, shades })

  return (
    <div className={classes.colorRow}>
      <input
        className={classes.colorPicker}
        type="color"
        value={color}
        onChange={(e) => setColor(e.currentTarget.value)}
      />
      <p className="code-font">{color}</p>
      <input
        className={clsx(['input', classes.name])}
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />

      <div className={clsx([classes.colorsSegment, classes.shades])}>
        {colors && colors.map((colorStep) => (
          <div
            className={clsx([classes.color, colorStep === color ? classes.current : ''])}
            style={{ background: colorStep }}
          />
        ))}
      </div>
    </div>
  )
}

type UseColorsProps = {
  color: string
  steps: number
  tints: boolean
  shades: boolean
}

function useColors({ color, steps, tints, shades }: UseColorsProps) {
  const stepsArray = useMemo(() => Array.from(Array(steps).keys()), [steps])

  const tintsArray = useMemo(() => (
    tints ? stepsArray.map((i) => tint(color, i, steps)).reverse() : []
  ), [steps, color, tints])

  const shadesArray = useMemo(() => (
    shades ? stepsArray.map((i) => shade(color, i, steps)) : []
  ), [steps, color, shades])

  return [...tintsArray, color, ...shadesArray]
}
