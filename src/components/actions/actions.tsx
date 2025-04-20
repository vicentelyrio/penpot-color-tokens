import { clsx } from '@utils/clsx'
import classes from './actions.module.css'

export type ActionsProps = {
  tints: boolean
  shades: boolean
  steps: number
  setTints: (tints: boolean) => void
  setShades: (shades: boolean) => void
  setSteps: (steps: number) => void
  onAddPalette: () => void
  onSavePalettes: () => void
}

export function Actions({
  tints,
  shades,
  steps,
  setTints,
  setShades,
  setSteps,
  onAddPalette,
  onSavePalettes,
}: ActionsProps) {
  return (
    <div className={classes.actions}>
      <div class={clsx(['checkbox-container', classes.field])}>
        <input
          className="checkbox-input"
          type="checkbox"
          id="tints"
          checked={tints}
          onChange={() => setTints(!tints)}
        />
        <label for="tints" className="code-font">Tints</label>
      </div>
      <div class="checkbox-container">
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
          value={steps}
          onChange={(e) => setSteps(parseInt(e.currentTarget.value))}
        />
        <label className="code-font" for="steps">Steps</label>
      </div>
      <button
        className={classes.add}
        data-appearance="secondary"
        onClick={onAddPalette}>
        Add color
      </button>
      <button
        className={classes.add}
        data-appearance="primary"
        onClick={onSavePalettes}>
        Generate palette
      </button>
    </div>
  )
}

