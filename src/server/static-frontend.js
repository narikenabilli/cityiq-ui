/**
 * Serves static client side code
 * In development environment it uses webpack-dev-middleware to serve code from the memory
 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const buildConfig = require('../../webpack.config.js');

const DIST_DIR = path.join(__dirname, '../../dist');

const isDevelopment = process.env.NODE_ENV === 'development';
const env = process.env.NODE_ENV || 'production';

const webpackConfig = buildConfig(env);

function staticFrontend(app) {
  if (isDevelopment) {
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: { colors: true },
    }));

    app.use(webpackHotMiddleware(compiler));
  } else {
    app.use(express.static(DIST_DIR));
  }
}

module.exports = staticFrontend;
