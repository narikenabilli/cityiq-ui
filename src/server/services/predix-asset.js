/**
 * Predix Asset Service
 *
 * Contains methods to create, retrieve and remove assets from Predix Asset Service.
 */

const rp = require('request-promise-native');
const config = require('../config/config');
const logger = require('../utils/logger');
const uaaUtil = require('predix-uaa-client');
const _ = require('lodash');
const querystring = require('querystring');

/**
 * Helper function to make requests to Predix Asset Service Usage interface is
 *    same with promisified request function Takes care about retrieving and
 *    renewing access_token
 *
 * @param  {Object} options request options
 *
 * @return {Promise}        resolves to requests response
 */
function requestPredix(options) {
  return uaaUtil.getToken(
    `${config.predix.uaaUrl}/oauth/token`,
    config.predix.clientId,
    config.predix.clientSecret
  ).then((auth) => {
    const authOptions = Object.assign({}, options);

    authOptions.headers = Object.assign({}, authOptions.headers, {
      'predix-zone-id': config.predix.zoneId,
      authorization: `Bearer ${auth.access_token}`,
    });

    return rp(authOptions);
  });
}

/**
 * Create assets
 *
 * @param  {String}       assetName Name of assets to create.
 * @param  {Array|Object} data      Array of assets objects to create or one asset object.
 *
 * @return {Promise}                Resolves if created successfully.
 */
function createAssets(assetName, data) {
  logger.verbose('Creating assets...');

  const options = {
    url: `${config.predix.apiUrl}/${assetName}`,
    method: 'post',
    json: true,
    body: !_.isArray(data) ? [data] : data,
  };

  logger.debug(`Request options ${JSON.stringify(options)}`);

  return requestPredix(options).then((res) => {
    logger.verbose('Successfully created.');

    return res;
  });
}

/**
 * Get assets by its name
 *
 * @param  {String}  assetName      Asset name.
 * @param  {String}  query          Optional request params.
 * @param  {String}  query.fields   Retrieves selected fields of a large
 *    object.
 * @param  {String}  query.filter   Use Graph Expression Language (GEL) to
 *    filter the data that appears in results.
 * @param  {String}  query.pageSize Defines the number of entities to be
 *    returned per page (default is 100).
 *
 * @return {Promise}           Resolves to the list of assets.
 */
function getAssets(assetName, query) {
  logger.verbose('Retrieving assets.');

  const options = {
    url: `${config.predix.apiUrl}/${assetName}${query ? `?${querystring.encode(query)}` : ''}`,
    method: 'get',
    json: true,
  };

  logger.verbose(`Request options ${JSON.stringify(options)}`);

  return requestPredix(options).then((res) => {
    logger.verbose('Successfully retrieved.');

    return res;
  });
}

/**
 * Remove assets by URI
 *
 * @param  {String} assetUri Asset URI to remove.
 *
 * @return {Promise}         Resolves if removed successfully.
 */
function removeAsset(assetUri) {
  logger.verbose(`Removing asset '${assetUri}'.`);

  const options = {
    url: `${config.predix.apiUrl}${assetUri}`,
    method: 'delete',
    json: true,
  };

  return requestPredix(options).then((res) => {
    logger.verbose(`Successfully removed '${assetUri}'.`);

    return res;
  });
}

/**
 * Remove all assets by name.
 *
 * @param  {String} assetName Assets name to remove.
 *
 * @return {Promise}          Resolves if removed successfully.
 */
function removeAssets(assetName) {
  return getAssets(assetName, { fields: 'uri' }).then(assets => (
    Promise.all(assets.map(asset => removeAsset(asset.uri)))
  ));
}

module.exports = {
  createAssets,
  getAssets,
  removeAssets,
  removeAsset,
};
