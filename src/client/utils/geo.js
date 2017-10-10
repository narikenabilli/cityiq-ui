/**
 * Helper GEO related methods
 */

/**
 * Convert Google Maps JavaScript API bounds to
 * an array of top-left and bottom-right points
 *
 * @param  {google.maps.LatLngBounds} bounds bounds
 *
 * @return {Array}                    array of two points
 */
const boundsToBoundrayBox = bounds => ([
  [bounds.getNorthEast().lat(), bounds.getSouthWest().lng()],
  [bounds.getSouthWest().lat(), bounds.getNorthEast().lng()],
]);

export default {
  boundsToBoundrayBox,
};
