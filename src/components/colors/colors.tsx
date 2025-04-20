import { clsx } from '@utils/clsx'
import classes from './colors.module.css'

export type ColorsProps = {
  palettes: Palette[]
  onSetPalette: (color: string, name: string, index: number) => void
}

export type ColorProps = {
  palette: Palette
  onSetPalette: (color: string, name: string, index: number) => void
  index: number
}

export function Colors({ palettes, onSetPalette }: ColorsProps) {
  return (
    <div className={classes.colors}>
      {palettes.map((palette, i) => (
        <Color
          key={i}
          palette={palette}
          onSetPalette={onSetPalette}
          index={i}
        />
      ))}
    </div>
  )
}

export function Color({ palette, onSetPalette, index }: ColorProps) {
  return (
    <div className={classes.colorRow}>
      <input
        className={classes.colorPicker}
        type="color"
        value={palette.color}
        onChange={(e) => onSetPalette(e.currentTarget.value, palette.name, index)}
      />
      <p className={clsx(['code-font', classes.colorLabel])}>{palette.color}</p>
      <input
        className={clsx(['input', classes.name])}
        type="text"
        value={palette.name}
        onChange={(e) => onSetPalette(palette.color, e.currentTarget.value, index)}
      />
      <div className={classes.colorsSegment}>
        {palette.colors.map((colorStep) => (
          <div
            className={clsx([classes.color, colorStep === palette.color ? classes.current : ''])}
            style={{ background: colorStep }}
            title={colorStep}
          />
        ))}
      </div>
    </div>
  )
}

