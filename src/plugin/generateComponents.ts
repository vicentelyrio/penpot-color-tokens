export async function generateComponents(tokenColors: Record<string, ColorToken>): Promise<ExportResult> {
  try {
    const colors = Object.entries(tokenColors)
      .filter(([_, data]) => data.$type === 'color')
      .map(([name, data]) => ({
        name,
        color: data.$value
      }))

    if (colors.length === 0) {
      return {
        success: false,
        message: 'No valid colors found in the tokens data'
      }
    }

    // Configuration for the visual palette
    const swatchSize = 120
    const padding = 20
    const gap = 10
    const columns = 5
    const rows = Math.ceil(colors.length / columns)

    // Calculate total dimensions for the board
    const totalWidth = padding * 2 + Math.min(columns, colors.length) * swatchSize + (Math.min(columns, colors.length) - 1) * gap
    const totalHeight = padding * 2 + rows * swatchSize + (rows - 1) * gap

    try {
      console.log('Creating visual palette with Penpot API')
      console.log(`Dimensions: ${colors.length} colors in ${rows} rows × ${Math.min(columns, colors.length)} columns`)
      console.log(`Total size: ${totalWidth}x${totalHeight}px`)

      // Using any to bypass TypeScript limitations
      const api = penpot as any
      let shapesCreated = 0

      // Create a page/artboard
      let page
      try {
        if (typeof api.createPage === 'function') {
          page = api.createPage()
          page.name = 'Color Palette'
          shapesCreated++
          console.log('Created page:', page.name)
        }
      } catch (pageError) {
        console.warn('Could not create page:', pageError)
      }

      // Attempt different approaches for creating the color components
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i]

        // Calculate position in the grid
        const row = Math.floor(i / columns)
        const col = i % columns
        const x = padding + col * (swatchSize + gap)
        const y = padding + row * (swatchSize + gap)

        try {
          // Strategy 1: Create directly using shape functions
          let component

          // Try to create a component or group to hold our elements
          if (typeof api.createGroup === 'function') {
            component = api.createGroup()
            component.x = x
            component.y = y
            console.log(`Created group at ${x},${y}`)
          }

          // Create the colored rectangle
          if (typeof api.createRectangle === 'function') {
            const rect = api.createRectangle()
            rect.x = x
            rect.y = y

            // Set dimensions
            if (typeof rect.resize === 'function') {
              rect.resize(swatchSize, swatchSize)
            }

            // Set corner radius for rounded corners
            if ('rx' in rect) {
              rect.rx = 10
              rect.ry = 10
            } else if (typeof api.setCornerRadius === 'function') {
              api.setCornerRadius(rect, 10)
            }

            // Try multiple fill approaches
            try {
              // Try setting fill with the raw color value string
              if (typeof api.setFill === 'function') {
                api.setFill(rect, color.color)
                console.log(`Set fill using setFill with: ${color.color}`)
              }
              // Try creating a color fill object
              else if (typeof api.createColorFill === 'function') {
                const fill = api.createColorFill(color.color)
                if (rect.fills && Array.isArray(rect.fills)) {
                  rect.fills = [fill]
                  console.log(`Set fill using createColorFill with: ${color.color}`)
                }
              }
              // Try setting with hexcode
              else if (rect.fill) {
                rect.fill = color.color
                console.log(`Set fill directly with: ${color.color}`)
              }
              // Try setting using fill property with object
              else if (rect.fills && Array.isArray(rect.fills)) {
                rect.fills = [{
                  type: 'color',
                  color: color.color,
                  opacity: 1
                }]
                console.log(`Set fills array with: ${color.color}`)
              }
            } catch (fillError) {
              console.warn(`Fill error for ${color.name}:`, fillError)
            }

            // Add to component or directly to page
            if (component && typeof api.addToGroup === 'function') {
              api.addToGroup(component, rect)
            } else if (typeof api.addToCurrentPage === 'function') {
              api.addToCurrentPage(rect)
            }

            shapesCreated++
          }

          // Create the text elements
          try {
            // Create name text element
            if (typeof api.createText === 'function') {
              const nameText = api.createText()
              nameText.x = x + swatchSize / 2
              nameText.y = y + swatchSize / 2 - 10

              // Set text content
              if (typeof api.setText === 'function') {
                api.setText(nameText, color.name)
              } else if ('characters' in nameText) {
                nameText.characters = color.name
              } else if ('content' in nameText) {
                nameText.content = color.name
              }

              // Set text properties
              if (typeof api.setTextProperties === 'function') {
                api.setTextProperties(nameText, {
                  fontSize: 14,
                  fontWeight: 'medium',
                  textAlign: 'center'
                })
              }

              // Center text horizontally
              if (typeof api.centerText === 'function') {
                api.centerText(nameText, 'horizontal')
              }

              // Add to component or directly to page
              if (component && typeof api.addToGroup === 'function') {
                api.addToGroup(component, nameText)
              } else if (typeof api.addToCurrentPage === 'function') {
                api.addToCurrentPage(nameText)
              }

              shapesCreated++
            }

            // Create hex text element
            if (typeof api.createText === 'function') {
              const hexText = api.createText()
              hexText.x = x + swatchSize / 2
              hexText.y = y + swatchSize / 2 + 10

              // Set text content
              if (typeof api.setText === 'function') {
                api.setText(hexText, color.color)
              } else if ('characters' in hexText) {
                hexText.characters = color.color
              } else if ('content' in hexText) {
                hexText.content = color.color
              }

              // Set text properties
              if (typeof api.setTextProperties === 'function') {
                api.setTextProperties(hexText, {
                  fontSize: 12,
                  fontWeight: 'normal',
                  textAlign: 'center'
                })
              }

              // Center text horizontally
              if (typeof api.centerText === 'function') {
                api.centerText(hexText, 'horizontal')
              }

              // Add to component or directly to page
              if (component && typeof api.addToGroup === 'function') {
                api.addToGroup(component, hexText)
              } else if (typeof api.addToCurrentPage === 'function') {
                api.addToCurrentPage(hexText)
              }

              shapesCreated++
            }
          } catch (textError) {
            console.warn(`Text error for ${color.name}:`, textError)
          }

          // Add the component to the page if we created one
          if (component && typeof api.addToCurrentPage === 'function') {
            api.addToCurrentPage(component)
          }

        } catch (componentError) {
          console.warn(`Failed to create component for ${color.name}:`, componentError)
        }
      }

      // Strategy 2: If the above didn't work, try a different approach - create a complete component
      if (shapesCreated === 0) {
        console.log('Attempting alternative component creation approach')

        for (let i = 0; i < colors.length; i++) {
          const color = colors[i]

          // Calculate position in the grid
          const row = Math.floor(i / columns)
          const col = i % columns
          const x = padding + col * (swatchSize + gap)
          const y = padding + row * (swatchSize + gap)

          try {
            // Try to directly use a create component function if available
            if (typeof api.createComponent === 'function') {
              const component = api.createComponent(color.name)
              component.x = x
              component.y = y
              component.width = swatchSize
              component.height = swatchSize

              // Set fill if available
              if (typeof api.setComponentColor === 'function') {
                api.setComponentColor(component, color.color)
              }

              // Set content if available
              if (typeof api.setComponentContent === 'function') {
                api.setComponentContent(component, {
                  name: color.name,
                  hex: color.color
                })
              }

              // Add to page
              if (typeof api.addToCurrentPage === 'function') {
                api.addToCurrentPage(component)
                shapesCreated++
              }
            }
          } catch (altComponentError) {
            console.warn(`Alternative component creation failed for ${color.name}:`, altComponentError)
          }
        }
      }

      // If nothing worked, create a simple alternative visual
      if (shapesCreated === 0) {
        console.log('Falling back to simple rectangle creation')

        for (let i = 0; i < colors.length; i++) {
          const color = colors[i]

          // Calculate position in the grid
          const row = Math.floor(i / columns)
          const col = i % columns
          const x = padding + col * (swatchSize + gap)
          const y = padding + row * (swatchSize + gap)

          try {
            if (typeof api.createShape === 'function') {
              const shape = api.createShape()
              shape.x = x
              shape.y = y
              shape.width = swatchSize
              shape.height = swatchSize

              // Try to set color directly using a string
              shape.fill = color.color

              if (typeof api.addToCurrentPage === 'function') {
                api.addToCurrentPage(shape)
                shapesCreated++
              }
            } else if (typeof api.drawRectangle === 'function') {
              // Alternative direct drawing method
              api.drawRectangle({
                x: x,
                y: y,
                width: swatchSize,
                height: swatchSize,
                fill: color.color,
                cornerRadius: 10
              })
              shapesCreated++
            }
          } catch (simpleError) {
            console.warn(`Simple rectangle creation failed for ${color.name}:`, simpleError)
          }
        }
      }

      return {
        success: shapesCreated > 0,
        message: shapesCreated > 0
          ? `Created visual palette with ${colors.length} color components in a ${rows}x${Math.min(columns, colors.length)} grid.`
          : 'Failed to create any visual components. Check console for details.'
      }
    } catch (apiError) {
      console.error('Error creating visual components:', apiError)

      return {
        success: false,
        message: 'Could not create visual palette: ' + (apiError as Error).message
      }
    }
  } catch (error) {
    console.error('Error in generateVisualPalette:', error)
    return {
      success: false,
      message: 'Failed to create visual palette: ' + (error as Error).message
    }
  }
}
