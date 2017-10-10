/**
 * Google Places Service
 *
 * Contains methods to make requests to Google Places API
 */

const rp = require('request-promise-native');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Search nearby places for given location.
 *
 * @param  {Object} filter           Filter for locations.
 * @param  {String} filter.type      Restricts the results to places matching
 *    the specified type. See
 *    https://developers.google.com/places/web-service/supported_types
 * @param  {String} filter.location  The latitude/longitude around which to
 *    retrieve place information. This must be specified as
 *    latitude,longitude.
 * @param  {Number} filter.radius    Defines the distance (in meters) within
 *    which to return place results.
 *
 * @return {Promise}                 Resolves to the list of nearby places.
 */
function searchNearby(filter) {
  const qs = Object.assign({}, filter, {
    key: config.google.places.key,
  });

  const options = {
    method: 'GET',
    url: `${config.google.places.apiUrl}/nearbysearch/json`,
    json: true,
    qs,
  };

  logger.verbose(`Search nearby places, request options ${JSON.stringify(options)}`);

  return rp(options).then((res) => {
    if (!res.results) {
      throw Error('Cannot find places in response.');
    }

    return res.results;
  });
}

module.exports = {
  searchNearby,
};
