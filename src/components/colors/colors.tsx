import { clsx } from '@utils/clsx'
import { CloseIcon } from '@components/icons/close-icon'
import classes from './colors.module.css'

export type ColorsProps = {
  palettes: Palette[]
  errors: number[]
  onSetPalette: (color: string, name: string, index: number) => void
  onRemovePalette: (index: number) => void
}

export function Colors({ palettes, errors, onSetPalette, onRemovePalette }: ColorsProps) {
  return (
    <div className={classes.colors}>
      {palettes.map((palette, i) => (
        <Color
          key={i}
          palette={palette}
          onSetPalette={onSetPalette}
          onRemovePalette={onRemovePalette}
          error={errors.includes(i)}
          index={i}
          multipleRows={palettes.length > 1}
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
  multipleRows: boolean
  error: boolean
}

export function Color({
  index,
  palette,
  error,
  multipleRows,
  onSetPalette,
  onRemovePalette,
}: ColorProps) {

  return (
    <div className={clsx([classes.colorRow, multipleRows ? classes.colorRowMultiple : ''])}>
      <input
        className={classes.colorPicker}
        type="color"
        value={palette.color}
        onChange={(e) => onSetPalette(e.currentTarget.value, palette.name, index)}
      />
      <p className={clsx(['code-font', classes.colorLabel])}>{palette.color}</p>
      <input
        className={clsx(['input', palette.name && !error ? '' : 'error', classes.name])}
        type="text"
        value={palette.name}
        placeholder="Palette name"
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
      {multipleRows && (
        <button
          className={classes.removeButton}
          data-appearance="secondary"
          onClick={() => onRemovePalette(index)}>
          <CloseIcon size={24} />
        </button>
      )}
    </div>
  )
}

