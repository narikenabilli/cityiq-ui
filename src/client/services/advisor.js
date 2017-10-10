/**
 * Advisor service
 */
import { encode as encodeQuerystring } from 'querystring';
import geoUtils from 'utils/geo';

// frontend is served by the same address as backend
const API_URL = `${window.location.origin || `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`}/api`;

/**
 * Handles fetch errors
 * Rejects promise instead of resolving it, when response is not OK
 *
 * @param  {Object} res response
 *
 * @return {Object}     response
 */
const handleErrors = (res) => {
  if (!res.ok) {
    throw res.statusText;
  }

  return res;
};

/**
 * Get advice
 *
 * @param  {Object}                   data                 advice request
 * @param  {String}                   data.placeType       place type
 * @param  {google.maps.LatLngBounds} data.location.bounds bounds of the area
 * @param  {google.maps.LatLng}       data.location.center coordinates of the center of location
 * @param  {Object}                   data.location.radius radius of the area
 *
 * @return {Promise}                  resolves to the advice data
 */
const getAdvice = (data) => {
  const params = {};

  if (data.location.bounds) {
    const boundaryBox = geoUtils.boundsToBoundrayBox(data.location.bounds);
    params.bbox = boundaryBox.map(point => (point.join(':'))).join(',');
  }

  if (data.location.center) {
    params.location = `${data.location.center.lat()},${data.location.center.lng()}`;
  }

  if (data.location.radius) {
    params.radius = data.location.radius;
  }

  if (data.placeType) {
    params.placeType = data.placeType;
  }

  return fetch(`${API_URL}/advice?${encodeQuerystring(params)}`, {
    method: 'get',
  }).then(handleErrors);
};

export default {
  getAdvice,
};
