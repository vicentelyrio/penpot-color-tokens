import { clsx } from '@utils/clsx'
import classes from './footer.module.css'
import { Help } from '@components/help/help'
import { NEW_TOKEN_SET } from '@consts/config'

export type FooterProps = {
  libraryMode: boolean
  jsonMode: boolean
  visualPaletteMode: boolean
  tokensMode?: boolean
  tokensAvailable?: boolean
  tokenSets?: TokenSetInfo[]
  targetSet?: string
  newSetName?: string
  hasError: boolean
  delimiter: Delimiter
  setLibraryMode: (mode: boolean) => void
  setJsonMode: (mode: boolean) => void
  setVisualPaletteMode: (mode: boolean) => void
  setDelimiter: (delimiter: Delimiter) => void
  setTokensMode?: (mode: boolean) => void
  setTargetSet?: (id: string) => void
  setNewSetName?: (name: string) => void
  onSavePalettes: () => void
}

export function Footer({
  libraryMode,
  visualPaletteMode,
  jsonMode,
  hasError,
  delimiter,
  tokensMode = false,
  tokensAvailable = false,
  tokenSets = [],
  targetSet = '',
  newSetName = '',
  setTokensMode,
  setTargetSet,
  setNewSetName,
  setLibraryMode,
  setVisualPaletteMode,
  setDelimiter,
  setJsonMode,
  onSavePalettes,
}: FooterProps) {
  return (
    <div className={classes.footer}>
      <div className={classes.row}>
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
          <Help description="Create a visual palette with the colors" />
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
          <Help description="Save as Tokens (json format)" />
        </div>
      </div>

      <div className={classes.row}>
        <div className={clsx(['form-group', 'checkbox-container', classes.fieldset])}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="tokensMode"
            checked={tokensMode}
            disabled={!tokensAvailable}
            onChange={() => setTokensMode?.(!tokensMode)}
          />
          <label for="tokensMode" className="code-font">Add to tokens</label>
          <Help description={tokensAvailable
            ? 'Add or update color tokens in an existing token set. Other tokens are left untouched'
            : 'Not available: requires Penpot 2.14 or newer'} />
        </div>
        {tokensMode && (
          <div className={clsx(['form-group', 'checkbox-container', classes.fieldset])}>
            <select
              className={clsx(['input', classes.setInput])}
              id="targetSet"
              value={targetSet}
              onChange={(e) => setTargetSet?.(e.currentTarget.value)}>
              <option value="" disabled>Select a set…</option>
              {tokenSets.map((set) => (
                <option key={set.id} value={set.id}>{set.name}</option>
              ))}
              <option value={NEW_TOKEN_SET}>New set…</option>
            </select>
            <label className="code-font" for="targetSet">Token set</label>
            {targetSet === NEW_TOKEN_SET && (
              <>
                <input
                  className={clsx(['input', classes.setInput])}
                  type="text"
                  id="newSetName"
                  value={newSetName}
                  onInput={(e) => setNewSetName?.(e.currentTarget.value)}
                />
                <label className="code-font" for="newSetName">Set name</label>
              </>
            )}
          </div>
        )}
      </div>

      <div className={classes.row}>
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
          <Help description="The delimiter to use in the color names (red-500 or red.500)" />
        </div>
        <button
          className={classes.generate}
          data-appearance="primary"
          disabled={hasError}
          onClick={onSavePalettes}>
          Generate
        </button>
      </div>
    </div>
  )
}
