module.exports = () => ({
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: [
    require('postcss-import')(),
    require('autoprefixer')(),
  ],
});
