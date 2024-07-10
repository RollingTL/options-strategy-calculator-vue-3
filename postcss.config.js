export default {
  plugins: {
    'postcss-preset-env': {
      stage: 0 // Enables all modern CSS features
    },
    autoprefixer: {} // Adds vendor prefixes for cross-browser compatibility
  }
}
