import { ComponentProps } from 'preact'
type IconProps = { size?: number } & ComponentProps<'svg'>

export function SquareIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={size} height={size} {...props}>
      <rect width="256" height="256" fill="none"/>
      <rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
    </svg>
  )
}
