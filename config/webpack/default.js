const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const webpack = require('webpack');

const context = path.resolve(__dirname, '../..');

module.exports = {
  context,

  entry: './src/client',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      styles: path.resolve(__dirname, '../../src/client/styles'),
    },
    extensions: ['.js', '.json', '.jsx', '.scss', '.css'],
  },

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
                targets: {
                  browsers: [ 'last 2 versions', '> 5%'],
                  uglify: true,
                },
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
                generateScopedName: '[hash:base64:6]',
              }],
            ],
          },
        },
      },
      {
        /* We need to support css loading for third-party plugins,
         * we are not supposed to use css files inside the project. */
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
    new ExtractCssChunks({
      filename: '[name].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};
