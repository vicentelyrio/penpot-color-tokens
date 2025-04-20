import { useState } from 'preact/hooks'
import { clsx } from '@utils/clsx'
import { Color } from './color'
import classes from './colors.module.css'

export type ColorsProps = {
  steps: number
  tints: boolean
  shades: boolean
}

export function Colors({ steps, tints, shades }: ColorsProps) {
  const [palettes, setPalettes] = useState(1)

  return (
    <div className={classes.colors}>
      {Array.from(Array(palettes).keys()).map((i) => (
        <Color
          key={i}
          steps={steps}
          tints={tints}
          shades={shades}
        />
      ))}
      <button
        className={classes.add}
        data-appearance="primary"
        onClick={() => setPalettes(palettes + 1)}>
        +
      </button>
    </div>
  )
}

