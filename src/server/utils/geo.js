/**
 * Geo coordinates related functions
 */

/**
 * Converts degrees to radians
 *
 * @param  {Number} degrees value in degrees
 *
 * @return {Number}         value in radians
 */
function deg2rad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 *
 * @param  {Number} rads value in radians
 *
 * @return {Number}      value in degrees
 */
function rad2deg(rads) {
  return (rads * 180) / Math.PI;
}

/**
 * Get the middle point on the line between two geo coordinates
 *
 * @param  {Object} point1 one point
 * @param  {Object} point2 second point
 *
 * @return {Object}        middle points
 */
function midpoint(point1, point2) {
  const lat1 = deg2rad(point1.lat);
  const lng1 = deg2rad(point1.lng);
  const lat2 = deg2rad(point2.lat);
  const lng2 = deg2rad(point2.lng);

  const dlng = lng2 - lng1;
  const Bx = Math.cos(lat2) * Math.cos(dlng);
  const By = Math.cos(lat2) * Math.sin(dlng);
  const latMiddle = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt(
      ((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx)) +
      (By * By)
    )
  );
  const lngMiddle = lng1 + Math.atan2(By, (Math.cos(lat1) + Bx));

  return { lat: rad2deg(latMiddle), lng: rad2deg(lngMiddle) };
}

module.exports = {
  deg2rad,
  rad2deg,
  midpoint,
};
