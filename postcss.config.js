import autoprefixer from 'autoprefixer'
import postcssNested from 'postcss-nested'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    autoprefixer(),
    postcssNested()
  ]
}
