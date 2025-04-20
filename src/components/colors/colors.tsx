import { Color } from './color'
import classes from './colors.module.css'

export type ColorsProps = {
  steps: number
  tints: boolean
  shades: boolean
  palettes: number
}

export function Colors({ steps, tints, shades, palettes }: ColorsProps) {
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
    </div>
  )
}

