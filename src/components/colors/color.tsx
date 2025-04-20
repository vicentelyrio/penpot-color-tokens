import { useState } from 'preact/hooks'
import { clsx } from '@utils/clsx'
import { useColors } from './useColors'
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

  const { colors } = useColors({ color, steps, tints, shades })

  return (
    <div className={classes.colorRow}>
      <input
        className={classes.colorPicker}
        type="color"
        value={color}
        onChange={(e) => setColor(e.currentTarget.value)}
      />
      <p className={clsx(['code-font', classes.colorLabel])}>{color}</p>
      <input
        className={clsx(['input', classes.name])}
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <div className={classes.colorsSegment}>
        {colors && colors.map((colorStep) => (
          <div
            className={clsx([classes.color, colorStep === color ? classes.current : ''])}
            style={{ background: colorStep }}
            title={colorStep}
          />
        ))}
      </div>
    </div>
  )
}

