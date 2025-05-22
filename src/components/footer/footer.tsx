import { clsx } from '@utils/clsx'
import classes from './footer.module.css'
import { Help } from '@components/help/help'

export type FooterProps = {
  libraryMode: boolean
  jsonMode: boolean
  visualPaletteMode: boolean
  delimiter: Delimiter
  setLibraryMode: (mode: boolean) => void
  setJsonMode: (mode: boolean) => void
  setVisualPaletteMode: (mode: boolean) => void
  setDelimiter: (delimiter: Delimiter) => void
  onSavePalettes: () => void
}

export function Footer({
  libraryMode,
  visualPaletteMode,
  jsonMode,
  delimiter,
  setLibraryMode,
  setVisualPaletteMode,
  setDelimiter,
  setJsonMode,
  onSavePalettes,
}: FooterProps) {
  return (
    <div className={classes.footer}>
      <div className={classes.options}>
        <div className={clsx(['form-group', 'checkbox-container', classes.fieldset])}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="libraryMode"
            checked={libraryMode}
            onChange={() => setLibraryMode(!libraryMode)}
          />
          <label for="libraryMode" className="code-font">Add to Library</label>
          <Help description="Add to the Color Library" />
        </div>
        <div className={clsx(['form-group', 'checkbox-container', classes.fieldset])}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="visualPaletteMode"
            checked={visualPaletteMode}
            onChange={() => setVisualPaletteMode(!visualPaletteMode)}
          />
          <label for="visualPaletteMode" className="code-font">Add components</label>
          <Help description="Save as a palette component" />
        </div>
        <div className={clsx(['form-group', 'checkbox-container', classes.fieldset])}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="jsonMode"
            checked={jsonMode}
            onChange={() => setJsonMode(!jsonMode)}
          />
          <label for="jsonMode" className="code-font">Export as JSON</label>
          <Help description="Save as a JSON file" />
        </div>

        <div className={clsx(['form-group', 'checkbox-container', classes.fieldset])}>
          <select
            className={clsx(['input', classes.delimiterInput])}
            id="delimiter"
            value={delimiter}
            onChange={(e) => setDelimiter(e.currentTarget.value as Delimiter)}>
            <option value=".">Dot [ . ]</option>
            <option value="-">Dash [ - ]</option>
          </select>
          <label className="code-font" for="delimiter">Delimiter</label>
          <Help description="The delimiter to use in the color names" />
        </div>
      </div>
      <button
        data-appearance="primary"
        onClick={onSavePalettes}>
        Generate
      </button>
    </div>
  )
}

