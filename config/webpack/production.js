const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const defaultConfig = require('./default');

module.exports = webpackMerge(defaultConfig, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractCssChunks.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              localIdentName: '[hash:base64:6]',
              modules: true,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ],
            },
          }, 'resolve-url-loader', {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }],
        }),
      }
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        safe: true,
        autoprefixer: {
          add: true,
          browsers: [
            'last 8 version',
            'IE 9'
          ]
        }
      }
    }),
  ],
});
