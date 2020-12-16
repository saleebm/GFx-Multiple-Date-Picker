import { resolve } from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'

require('@babel/register')

// regex for scripts
const reScript = /\.js$/

// regex for styles
const reStyle = /\.(css|less|styl|scss|sass|sss)$/

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: {
      admin: resolve(__dirname, 'src/index.js'),
    },
    mode: isProduction ? 'production' : 'development',
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'dist'),
      crossOriginLoading: 'use-credentials',
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    cache: isProduction,
    devtool: isProduction ? false : 'source-map',
    performance: {
      hints: 'warning',
    },
    resolve: {
      modules: ['src', 'node_modules'],
      extensions: ['*', '.js', '.jsx', '.css', '.scss'],
      alias: {
        // Allows for better profiling with ReactDevTools
        ...(isProduction && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
      },
    },
    target: 'web',
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        {
          // Preprocess 3rd party .css files located in node_modules
          test: /\.css$/,
          include: /[\\/]node_modules[\\/]/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: reStyle,
          exclude: /[\\/]node_modules[\\/]/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'resolve-url-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  sourceComments: !isProduction,
                  sourceMapContents: isProduction,
                  outputStyle: 'expanded',
                },
              },
            },
          ],
        },
        {
          test: reScript,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
      }),
      new CircularDependencyPlugin({
        exclude: /a\.(jsx?)|node_modules/,
        failOnError: true,
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.jsx?$|\.css$|\.(scss|sass)$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin()],
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          common: {
            name: 'common',
            chunks: 'all',
          },
        },
      },
    },
  }
}
