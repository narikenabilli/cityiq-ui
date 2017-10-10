const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true',
    defaultConfig.entry,
  ],

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['env', {
                'targets': {
                  'browsers': [ 'last 2 versions', '> 5%'],
                  'uglify': true,
                },
                modules: false,
              }],
              'react',
              'stage-2'
            ],
            plugins: [
              ['module-resolver', {
                extensions: ['.js', '.jsx'],
                root: [
                  './src/client'
                ],
              }],
              ['react-css-modules', {
                filetypes: {
                  '.scss': {
                    syntax: 'postcss-scss',
                  },
                },
                generateScopedName: '[path][name]___[local]',
              }],
              'react-hot-loader/babel',
            ],
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractCssChunks.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              localIdentName: '[path][name]___[local]',
              modules: true,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ],
              sourceMap: true,
            },
          }, 'resolve-url-loader', {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }],
        }),
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
});
