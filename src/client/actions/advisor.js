/**
 * Advisor actions
 */
import { createActions } from 'redux-actions';
import { noop, identity } from 'lodash/noop';
import { toastr } from 'react-redux-toastr';
import advisorService from 'services/advisor';

/**
 * Get advice
 *
 * @param  {Object}                   data                 advice request
 * @param  {String}                   data.placeType       place type
 * @param  {google.maps.LatLngBounds} data.location.bounds bounds of the area
 * @param  {google.maps.LatLng}       data.location.center coordinates of the center of location
 * @param  {Object}                   data.location.radius radius of the area
 *
 * @return {Promise}                  advice data
 */
const getAdvice = data => advisorService.getAdvice(data).then(res => res.json())
  .then((adviceData) => {
    const hasPedestriandData = !!(adviceData.pedestrianLocations
      && adviceData.pedestrianLocations.length);
    const hasTrafficData = !!(adviceData.trafficLocations && adviceData.trafficLocations.length);
    const hadPlacesData = !!(adviceData.places && adviceData.places.length);

    if (!hasPedestriandData || !hasTrafficData) {
      if (!hadPlacesData) {
        toastr.warning('No data for this area.');
      } else {
        toastr.warning('No pedestrian and traffic data for this area.');
      }
    }

    return adviceData;
  })
  .catch(() => {
    toastr.error('Cannot get data from the server.', 'Please, try one more time.');
  });

export default createActions({
  ADVISOR: {
    GET_ADVICE_INIT: noop,
    GET_ADVICE_DONE: getAdvice,
    SET_LOCATION: identity,
    SET_PLACE_TYPE: identity,
  },
});
