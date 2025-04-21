# Penpot Color Tokens

A plugin for Penpot that generates color palettes from W3C design tokens format.

## Features

- Creates color swatches from W3C design tokens
- Adds colors to the Penpot library
- Generates visual color palette with:
  - Color swatches
  - Color names
  - Hex values
  - Automatically adjusts text color for readability

## Usage

1. Install the plugin in your Penpot workspace
2. Prepare your color tokens in W3C design tokens format:

```json
{
  "color": {
    "primary": { "value": "#0066CC", "type": "color" },
    "secondary": { "value": "#FF6347", "type": "color" },
    "accent": { "value": "#FFD700", "type": "color" }
  }
}
```

3. Call the `onSavePalettes` function with your tokens
4. The plugin will create a grid of color swatches and add the colors to your library

## API Integration

The plugin uses the following Penpot API functions:

- `createRectangle` - Creates the color swatch rectangles
- `createText` - Creates text elements for color names and hex values
- `addLibraryColor` - Adds colors to the Penpot library
- `addToCurrentPage` - Adds elements to the current page
- `centerInViewport` - Centers the generated palette in the viewport

## Customization

You can customize the plugin by modifying:

- `swatchSize` - Size of each color swatch
- `padding` - Padding around the palette
- `gap` - Space between swatches
- `columns` - Number of columns in the grid

## Example

```javascript
// Example usage
const tokens = {
  "color": {
    "primary": { "value": "#0066CC", "type": "color" },
    "secondary": { "value": "#FF6347", "type": "color" },
    "accent": { "value": "#FFD700", "type": "color" }
  }
};

onSavePalettes(tokens);
```

## License

MIT
