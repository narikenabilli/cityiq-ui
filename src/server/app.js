/**
 * Express based server
 * Which serves:
 * - frontend client code
 * - advisor API
 */

const express = require('express');
const logger = require('./utils/logger');
const expressLogging = require('express-logging');
const staticFronend = require('./static-frontend');
const advisor = require('./adivsor');

const app = express();

/**
 * Log express requests
 */
app.use(expressLogging(logger));

/**
 * Serve advisor
 */
app.use('/api', advisor);

/**
 * Serve static frontend
 */
staticFronend(app);

module.exports = app;
