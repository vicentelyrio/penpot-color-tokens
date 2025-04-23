import classes from './footer.module.css'

export type FooterProps = {
  libraryMode: boolean
  jsonMode: boolean
  visualPaletteMode: boolean
  setLibraryMode: (mode: boolean) => void
  setJsonMode: (mode: boolean) => void
  setVisualPaletteMode: (mode: boolean) => void
  onSavePalettes: () => void
}

export function Footer({
  libraryMode,
  visualPaletteMode,
  jsonMode,
  onSavePalettes,
  setLibraryMode,
  setVisualPaletteMode,
  setJsonMode,
}: FooterProps) {
  return (
    <div className={classes.footer}>
      <div className={classes.options}>
        <div class="checkbox-container">
          <input
            className="checkbox-input"
            type="checkbox"
            id="libraryMode"
            checked={libraryMode}
            onChange={() => setLibraryMode(!libraryMode)}
          />
          <label for="libraryMode" className="code-font">Add to Library</label>
        </div>
        <div class="checkbox-container">
          <input
            className="checkbox-input"
            type="checkbox"
            id="visualPaletteMode"
            checked={visualPaletteMode}
            onChange={() => setVisualPaletteMode(!visualPaletteMode)}
          />
          <label for="visualPaletteMode" className="code-font">Add components</label>
        </div>
        <div class="checkbox-container">
          <input
            className="checkbox-input"
            type="checkbox"
            id="jsonMode"
            checked={jsonMode}
            onChange={() => setJsonMode(!jsonMode)}
          />
          <label for="jsonMode" className="code-font">Export as JSON</label>
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

