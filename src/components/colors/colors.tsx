import { Color } from './color'
import classes from './colors.module.css'

export type ColorsProps = {
  steps: number
  tints: boolean
  shades: boolean
}

export function Colors({ steps, tints, shades }: ColorsProps) {
  return (
    <div className={classes.colors}>
      <Color
        steps={steps}
        tints={tints}
        shades={shades}
      />
    </div>
  )
}

