import { useCallback, useRef, useState } from 'preact/hooks'
import { useOnClickOutside } from 'usehooks-ts'
import useEyeDropper from 'use-eye-dropper'
import { HexColorPicker } from 'react-colorful'

import { clsx } from '@utils/clsx'
import { CloseIcon } from '@components/icons/close'
import { EyedropperIcon } from '@components/icons/eyedropper'

import classes from './colors.module.css'

export type ColorsProps = {
  palettes: Palette[]
  errors: Record<string, number[]>
  colorType: ColorType
  onSetPalette: (color: string, name: string, index: number) => void
  onRemovePalette: (index: number) => void
}

export function Colors({
  palettes,
  errors,
  colorType,
  onSetPalette,
  onRemovePalette
}: ColorsProps) {
  return (
    <div className={classes.colors}>
      {palettes.map((palette, i) => (
        <Color
          key={i}
          palette={palette}
          onSetPalette={onSetPalette}
          onRemovePalette={onRemovePalette}
          errors={errors}
          colorType={colorType}
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
  colorType: ColorType
  index: number
  multipleRows: boolean
  errors: Record<string, number[]>
}

export function Color({
  index,
  palette,
  errors,
  colorType,
  multipleRows,
  onSetPalette,
  onRemovePalette,
}: ColorProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [showWheel, setShowWheel] = useState(false)
  const { open, isSupported } = useEyeDropper()
  useOnClickOutside(ref, () => setShowWheel(false))

  const pickColor = useCallback((name: string, index: number) => {
    const openPicker = async () => {
      try {
        const color = await open()
        onSetPalette(color.sRGBHex, name, index)
      }
      catch {}
    }
    openPicker()
  }, [open])

  console.log(errors)
  const nameError = palette.name && !errors['name']?.includes(index) ? '' : 'error'
  const colorError = palette.color && !errors['color']?.includes(index) ? '' : 'error'

  return (
    <div className={clsx([classes.colorRow, multipleRows ? classes.colorRowMultiple : ''])}>
      <div
        className={classes.colorPicker}
        style={{ background: palette.color }}
        onClick={(e) => {
          e.preventDefault()
          setShowWheel(true)
        }}
      />
      <div
        ref={ref}
        className={clsx([classes.colorWheel, showWheel ? classes.showWheel : ''])}>
        <HexColorPicker
          color={palette.color}
          onChange={(color) => onSetPalette(color, palette.name, index)}
        />
      </div>
      {isSupported() && (
        <EyedropperIcon
          className={classes.eyedropperIcon}
          onClick={() => pickColor(palette.name, index)}
        />
      )}
      <input
        className={clsx(['input', classes.inputColor, colorError])}
        type="text"
        value={palette.color}
        placeholder="Palette color"
        onChange={(e) => onSetPalette(e.currentTarget.value, palette.name, index)}
      />
      <input
        className={clsx(['input', classes.inputName, nameError])}
        type="text"
        value={palette.name}
        placeholder="Palette name"
        onChange={(e) => onSetPalette(palette.color, e.currentTarget.value, index)}
      />
      <div className={clsx([classes.colorsSegment, classes[colorType]])}>
        {palette.colors.map((colorStep) => (
          <div
            className={clsx([classes.color, classes[colorType], colorStep === palette.color ? classes.current : ''])}
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

