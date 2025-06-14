import { CSSProperties } from 'react-dom/src'
import { useState } from 'preact/hooks'
import { clsx } from '@utils/clsx'
import classes from './help.module.css'

export interface HelpProps {
  description: string
  className?: string
  hideIcon?: boolean
  style?: CSSProperties
}

export function Help({ description, className, hideIcon, style }: HelpProps) {
  const [show, setShow] = useState(false)

  return (
    <div
      style={style}
      className={clsx([classes.help, className ?? ''])}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {!hideIcon && (
        <div className={classes.box}>
          <span className={clsx(['code-font', classes.label])}>?</span>
        </div>
      )}
      <div className={clsx([classes.tooltip, show ? classes.show : ''])}>
        <span className="code-font">{description}</span>
      </div>
    </div>
  )
}
