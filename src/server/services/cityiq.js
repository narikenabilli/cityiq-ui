/**
 * CityIQ Service
 *
 * Contains methods to make requests to CityIQ service.
 */

const rp = require('request-promise-native');
const config = require('../config/config');
const logger = require('../utils/logger');
const uaaUtil = require('predix-uaa-client');

/**
 * Helper function to make requests to CItyIQ Service Usage interface is same
 *    with promisified request function Takes care about retrieving and
 *    renewing access_token
 *
 * @param  {Object} options request options
 *
 * @return {Promise}        resolves to requests response
 */
function requestCityIQ(options, predixZoneId) {
  return uaaUtil.getToken(
    `${config.cityiq.uaaUrl}/oauth/token?grant_type=client_credentials`,
    config.cityiq.clientId,
    config.cityiq.clientSecret
  ).then((auth) => {
    const authOptions = Object.assign({}, options);

    authOptions.headers = Object.assign({}, authOptions.headers, {
      'predix-zone-id': predixZoneId,
      authorization: `Bearer ${auth.access_token}`,
    });

    return rp(authOptions);
  });
}

/**
 * Search locations
 *
 * @param  {String} predixZoneId Predix zone id.
 * @param  {Object} filter       Filter of locations.
 * @param  {String} filter.q     Identifies a "type" query, ex:
 *    'locationType:TRAFFIC_LANE'.
 * @param  {String} filter.bbox  The bounded area for your search, ex:
 *    '32.715675:-117.161230, 32.708498:-117.151681'.
 * @param  {Number} filter.size  Maximum number of records to return per page.
 * @param  {Number} filter.page  Indicates the page number.
 *
 * @return {Promise}             Resolves to the list of locations.
 */
function searchLocations(predixZoneId, filter) {
  logger.verbose('Search locations...');

  const options = {
    url: `${config.cityiq.metadataUrl}/locations/search`,
    method: 'GET',
    qs: filter,
    json: true,
  };

  logger.verbose(`Search locations, request options ${JSON.stringify(options)}`);

  return requestCityIQ(options, predixZoneId).then((data) => {
    if (!data || !data.content) {
      throw Error('Cannot get location list from response.');
    }

    logger.verbose(`Successfully got ${data.content.length} of ${data.totalElements} locations.`);

    return data.content;
  }).catch((err) => {
    // if there are no locations, server returns error which we transform to an empty array instead
    if (err.error && err.error.message && (err.error.message.indexOf('No locations found for subscriber UID') > -1)) {
      return [];
    }
    throw Error(err);
  });
}

/**
 * Search events
 *
 * @param  {String} predixZoneId      Predix zone id.
 * @param  {Object} filter            Filter of locations.
 * @param  {String} filter.eventTypes Event type, ex: 'PEDEVT' or 'TFEVT'.
 * @param  {String} filter.bbox       The bounded area for your search, ex:
 *    '32.715675:-117.161230, 32.708498:-117.151681'.
 * @param  {Number} filter.startTime  Start time (timestamp).
 * @param  {Number} filter.endTime    End time (timestamp).
 *
 * @return {Promise}                  Resolves to the list of locations.
 */
function searchEvents(predixZoneId, filter) {
  logger.verbose('Search events...');

  const options = {
    url: `${config.cityiq.eventUrl}/locations/events`,
    method: 'GET',
    qs: filter,
    json: true,
  };

  logger.verbose(`Search events, request options ${JSON.stringify(options)}`);

  return requestCityIQ(options, predixZoneId).then((data) => {
    if (!data || !data.content) {
      throw Error('Cannot get events from response.');
    }

    logger.verbose(`Successfully got ${data.content.length} events.`);

    return data.content;
  }).catch((err) => {
    // if there are no events, server unexpectedly returns unknown error
    // we transform it an empty array instead
    if (err.error && err.error['error-message'] && err.error['error-message'] === 'Un Known Error.500 Internal Server Error') {
      return [];
    }
    throw Error(err);
  });
}

module.exports = {
  searchLocations,
  searchEvents,
};
