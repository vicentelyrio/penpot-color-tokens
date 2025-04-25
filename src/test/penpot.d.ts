declare global {
  interface ColorToken {
    $type: string
    $value: string
  }

  interface ExportResult {
    success: boolean
    message: string
  }

  const penpot: {
    createRectangle: () => any
    createText: (text?: string) => any
    group: (elements: any[]) => any
    selection: any[]
  }
}

export {} 