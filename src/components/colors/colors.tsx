import { clsx } from '@utils/clsx'
import classes from './colors.module.css'

export type ColorsProps = {
  palettes: Palette[]
  onSetPalette: (color: string, name: string, index: number) => void
  onRemovePalette: (index: number) => void
}

export function Colors({ palettes, onSetPalette, onRemovePalette }: ColorsProps) {
  return (
    <div className={classes.colors}>
      {palettes.map((palette, i) => (
        <Color
          key={i}
          palette={palette}
          onSetPalette={onSetPalette}
          onRemovePalette={onRemovePalette}
          index={i}
        />
      ))}
    </div>
  )
}

export type ColorProps = {
  palette: Palette
  onSetPalette: (color: string, name: string, index: number) => void
  onRemovePalette: (index: number) => void
  index: number
}

export function Color({
  index,
  palette,
  onSetPalette,
  onRemovePalette,
}: ColorProps) {
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
      {index > 0 && (
        <button
          className={classes.removeButton}
          data-appearance="secondary"
          onClick={() => onRemovePalette(index)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

