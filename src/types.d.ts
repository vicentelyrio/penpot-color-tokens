type Palette = {
  name: string
  color: string
  colors: string[]
}

type ColorToken = {
  $type: string
  $value: string
}

type ResultItem = {
  name: string
  success: boolean
  skipped?: boolean
  message?: string
  error?: string
  colorId?: string
}

type GenerationResult = {
  success: boolean
  message: string
  results?: ResultItem[]
  stats?: {
    created: number
    skipped: number
    failed: number
  }
}

type ExportResult = {
  success: boolean
  message: string
  result?: string
}

type Message = {
  type: string
  name?: string
  color?: string
  colors?: Array<{ name: string; value: string; path?: string }>
  tokens?: Record<string, { $type: string; $value: string }>
  content?: any
}
