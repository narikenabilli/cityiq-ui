/**
 * Logger
 */

const config = require('../config/config');
const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: config.logLevel,
      colorize: true,
    }),
  ],
});

module.exports = logger;
