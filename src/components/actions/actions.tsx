import { clsx } from '@utils/clsx'
import {
  SegmentControl,
  type SegmentControlItem
} from '@components/segment-control/segment-control'

import { CircleIcon } from '@components/icons/circle'
import { PaletteIcon } from '@components/icons/palette'
import { SquareIcon } from '@components/icons/square'

import classes from './actions.module.css'

export type ActionsProps = {
  tints: boolean
  shades: boolean
  steps: number
  colorType: ColorType
  setTints: (tints: boolean) => void
  setShades: (shades: boolean) => void
  setSteps: (steps: number) => void
  setColorType: (colorType: ColorType) => void
  onAddPalette: () => void
}

export function Actions({
  tints,
  shades,
  steps,
  colorType,
  setTints,
  setShades,
  setSteps,
  setColorType,
  onAddPalette,
}: ActionsProps) {
  const items: SegmentControlItem[] = [
    { item: <PaletteIcon />, type: 'segment' },
    { item: <SquareIcon />, type: 'square' },
    { item: <CircleIcon />, type: 'circle' },
  ]

  return (
    <div className={classes.actions}>
      <div className={classes.options}>
        <div className={clsx(['form-group', 'checkbox-container'])}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="tints"
            checked={tints}
            onChange={() => setTints(!tints)}
          />
          <label for="tints" className="code-font">Tints</label>
        </div>
        <div className={clsx(['form-group', 'checkbox-container'])}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="shades"
            checked={shades}
            onChange={() => setShades(!shades)}
          />
          <label for="shades" className="code-font">Shades</label>
        </div>
        <div className={clsx(['form-group', classes.steps])}>
          <input
            className={clsx(['input', classes.stepsInput])}
            type="number"
            placeholder="Steps"
            id="steps"
            min={0}
            value={steps}
            onChange={(e) => setSteps(parseInt(e.currentTarget.value))}
          />
          <label className="code-font" for="steps">Steps</label>
        </div>
      </div>
      <div className={classes.confirm}>
        <SegmentControl
          colorType={colorType}
          setColorType={setColorType}
          items={items}
        />
        <button
          disabled={steps < 0}
          data-appearance="primary"
          onClick={onAddPalette}>
          Add color
        </button>
      </div>
    </div>
  )
}
