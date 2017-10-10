/**
 * API to process advice requests.
 *
 * Uses CityIQ and Google Places services to get data about provided location.
 */

const config = require('./config/config');
const logger = require('./utils/logger');
const express = require('express');
const cityiqService = require('./services/cityiq');
const predixAsssetService = require('./services/predix-asset');
const googlePlacesService = require('./services/google-places');
const geo = require('./utils/geo');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

const router = express.Router();

// start date and time to get pedestrian events
const PEDESTRIAN_EVENTS_START_DATE = 'Tue Sep 12 2017 08:00:00 GMT-0800';
// duration in minutes during which we will get events
// on the one hand we have to keep it small, so we always get less then 1000 events
// because backend has limit of 1000 events. On the other hand we have to get maximum
// quantity of event to represent situation.
const PEDESTRIAN_EVENTS_DURATION = 10;

// start date and time to get pedestrian events
const TRAFFIC_EVENTS_START_DATE = 'Tue Sep 12 2017 08:00:00 GMT-0800';
// duration in minutes during which we will get events
// value is chosen using the same thought as for PEDESTRIAN_EVENTS_DURATION
const TRAFFIC_EVENTS_DURATION = 5;

// maximum quantity of locations to request
const MAXIMUM_LOCATIONS = 1000;

/**
 * Aggregate events by locations
 *
 * @param  {Array} events        events list
 * @param  {Array} locations     locations list
 * @param  {String} countProperty property of event object which contains
 *    quantity value of the event
 *
 * @return {Array}               list of locations with total quantity of
 *    events occurred
 */
function aggregateEvents(events, locations, countProperty) {
  const data = [];

  // get only necessary values and convert array of locations to object
  const locationsObject = _.keyBy(_.map(locations, location => ({
    locationUid: location.locationUid,
    coordinates: location.coordinates,
    eventsCount: 0,
  })), 'locationUid');

  // calculate event quantities in locations
  events.forEach((event) => {
    if (!locationsObject[event.locationUid]) {
      logger.warn('Location for event is not found.');
      return;
    }

    locationsObject[event.locationUid].eventsCount += event.measures[countProperty];
  });

  // create a list of locations including aggregated events quantity
  _.forOwn(locationsObject, (location) => {
    const points = location.coordinates.split(',').map(point => point.split(':').map(coordinate => parseFloat(coordinate, 10)));

    if (location.eventsCount) {
      const midPoint = geo.midpoint(
        { lat: points[0][0], lng: points[0][1] },
        { lat: points[1][0], lng: points[1][1] }
      );

      data.push({
        coordinates: { lat: midPoint.lat, lng: midPoint.lng },
        eventsCount: location.eventsCount,
      });
    }
  });

  return data;
}

/**
 * Get pedestrian situation data. Uses short period of time to quickly
 *    estimate situation.
 *
 * @param  {Object} query      Query for events
 * @param  {String} query.bbox The bounded area for your search, ex:
 *    '32.715675:-117.161230, 32.708498:-117.151681'.
 *
 * @return {Promise}           Resolves to the object with the list of
 *    locations, and list of events.
 */
function getPedestrianOverview(query) {
  const startDate = new Date(PEDESTRIAN_EVENTS_START_DATE);
  const endDate = new Date(PEDESTRIAN_EVENTS_START_DATE);
  endDate.setMinutes(startDate.getMinutes() + PEDESTRIAN_EVENTS_DURATION);

  const locationsFilter = {
    q: 'locationType:WALKWAY',
    bbox: query.bbox,
    size: MAXIMUM_LOCATIONS,
  };

  const eventsFilter = {
    locationType: 'WALKWAY',
    bbox: query.bbox,
    eventType: 'PEDEVT',
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
  };

  return Promise.all([
    cityiqService.searchEvents(config.cityiq.predixZoneIds.pedestrian, eventsFilter),
    cityiqService.searchLocations(config.cityiq.predixZoneIds.pedestrian, locationsFilter),
  ]).then(([pedestrianEvents, pedestrianLocations]) => ({
    pedestrianLocations: aggregateEvents(pedestrianEvents, pedestrianLocations, 'pedestrianCount'),
  }));
}

/**
 * Get traffic situation data. Uses short period of time to quickly estimate
 *    situation.
 *
 * @param  {Object} query      Query for events
 * @param  {String} query.bbox The bounded area for your search, ex:
 *    '32.715675:-117.161230, 32.708498:-117.151681'.
 *
 * @return {Promise}           Resolves to the object with the list of
 *    locations, and list of events.
 */
function getTrafficOverview(query) {
  const startDate = new Date(TRAFFIC_EVENTS_START_DATE);
  const endDate = new Date(TRAFFIC_EVENTS_START_DATE);
  endDate.setMinutes(startDate.getMinutes() + TRAFFIC_EVENTS_DURATION);

  const locationsFilter = {
    q: 'locationType:TRAFFIC_LANE',
    bbox: query.bbox,
    size: MAXIMUM_LOCATIONS,
  };

  const eventsFilter = {
    locationType: 'TRAFFIC_LANE',
    bbox: query.bbox,
    eventType: 'TFEVT',
    startTime: startDate.getTime(),
    endTime: endDate.getTime(),
  };

  return Promise.all([
    cityiqService.searchEvents(config.cityiq.predixZoneIds.traffic, eventsFilter),
    cityiqService.searchLocations(config.cityiq.predixZoneIds.traffic, locationsFilter),
  ]).then(([trafficEvents, trafficLocations]) => ({
    trafficLocations: aggregateEvents(trafficEvents, trafficLocations, 'vehicleCount'),
  }));
}

/**
 * Get nearby places by location.
 *
 * @param  {Object} query            Query for locations.
 * @param  {String} query.placeType  Restricts the results to places matching
 *    the specified type. See
 *    https://developers.google.com/places/web-service/supported_types
 * @param  {String} query.location   The latitude/longitude around which to
 *    retrieve place information. This must be specified as
 *    latitude,longitude.
 * @param  {Number} query.radius     Defines the distance (in meters) within
 *    which to return place results.
 *
 * @return {Promise}                 Resolves to the list of nearby places.
 */
function getNearbyPlaces(query) {
  const filter = {
    type: query.placeType,
    radius: query.radius,
    location: query.location,
  };

  return googlePlacesService.searchNearby(filter).then(places => ({
    places,
  }));
}

/**
 * Save advice data to Predix Asset Service.
 *
 * @param  {Object} query User request for an advice.
 * @param  {Object} data  Data of pedestrians, traffic and competitors.
 *
 * @return {Promise}      Resolves successfully if saved.
 */
function saveAdvice(query, data) {
  return predixAsssetService.createAssets('advice', {
    uri: `/advice/${uuidv4()}`,
    query,
    data,
    createdAt: (new Date()).getTime(),
  });
}

/**
 * Endpoint to retrieve advices about location.
 */
router.get('/advice', (req, res) => {
  Promise.all([
    getPedestrianOverview(req.query),
    getTrafficOverview(req.query),
    getNearbyPlaces(req.query),
  ]).then((reponses) => {
    const data = _.assign(...reponses);

    saveAdvice(req.query, data).then(() => {
      logger.verbose('Advice request saved to Predix Asset Service.');
    });

    res.send(data);
  }).catch((err) => {
    logger.error(err);
    res.statusCode = 500;
    res.send(err);
  });
});

module.exports = router;
