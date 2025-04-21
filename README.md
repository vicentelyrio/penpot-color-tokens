# Penpot Color Tokens

A Penpot plugin that allows you to generate color palettes and add them to your Penpot designs.

## Features

- Generate tints and shades from a base color
- Customize the number of color steps in your palette

## Usage

1. Open your Penpot project
2. Navigate to the plugins section
3. Load the **Penpot Color Tokens** plugin
4. Select a base color and adjust the tint/shade settings
5. Generate your palette and add it to your Penpot library

## Development

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Start the development server:
   ```
   pnpm dev
   ```

#### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/)
- [Penpot](https://penpot.app/)

#### Project Structure

- `src/` - Source code
  - `components/` - React components
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `plugin.ts` - Main plugin integration with Penpot
  - `test/` - Test setup and utilities

#### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the plugin for production
- `pnpm preview` - Preview the built plugin
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

## Testing

The project uses Vitest and Testing Library for tests. Here's how to run them:

```bash
# Run tests once
pnpm test

# Run tests in watch mode (during development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

Tests are organized alongside the code they're testing, following a `.test.ts` or `.test.tsx` naming convention.

## Technologies

- [Preact](https://preactjs.com/) - A lightweight alternative to React
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [Vite](https://vitejs.dev/) - For fast development and building
- [Penpot Plugin API](https://help.penpot.app/technical-guide/plugins/) - For integration with Penpot
- [Vitest](https://vitest.dev/) - For testing
- [Testing Library](https://testing-library.com/docs/preact-testing-library/intro/) - For component testing

## License

See the [LICENSE](LICENSE) file for details.
