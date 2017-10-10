/**
 * This AdvisorMapWithControls component
 *
 * Basically if handles all the stuff related to google maps.
 * - loads Google Maps JavaScript library
 * - handles some inner stuff between AdvisorControls and AdvisorMap components
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PT from 'prop-types';
import { compose, withProps, lifecycle, withState } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
} from "react-google-maps";
import AdvisorMap from './AdvisorMap';
import AdvisorControls from './AdvisorControls';
import Loader from 'components/Loader';
import config from 'config/config';
import './styles.scss';

// use this value when determine radius around location when user choose location by clicking on the map
const GOLDEN_RATIO = 1.618;

// quantity of decimal values in coordinates values which we show to user
const COORDINATES_DECIMALS = 7;

// google maps URL contains the list of required libraries
const GOOGLE_MAPS_URL = `${config.GOOGLE_MAPS_API_URL}&libraries=geometry,drawing,places,visualization&key=${config.GOOGLE_MAPS_KEY}`

/**
 * Get radius of the maximum circle with the center in the defined location
 *    which can fit defined bounds
 *
 * @param  {google.maps.LatLngBounds} bounds   bounds to fit
 * @param  {google.maps.LatLng}       location location of the center of the circle
 *
 * @return {Number}                    radius
 */
function getBoundsMiximalRadius(bounds, location) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const sides = [
    new google.maps.LatLng({ lat: location.lat(), lng: sw.lng() }),
    new google.maps.LatLng({ lat: sw.lat(), lng: location.lng() }),
    new google.maps.LatLng({ lat: location.lat(), lng: ne.lng() }),
    new google.maps.LatLng({ lat: ne.lat(), lng: location.lng() }),
  ];
  const distances = sides.map(side => (
    google.maps.geometry.spherical.computeDistanceBetween(side, location)
  ));
  const radius = Math.min(...distances);

  return radius;
}

/**
 * Get average value in array
 *
 * @param  {Array<Number>} values array of values
 *
 * @return {Number}        average value
 */
function average(values){
  const sum = values.reduce(function(sum, value){
    return sum + value;
  }, 0);

  const avg = sum / values.length;

  return avg;
}

const AdvisorMapWithControls = compose(
  withProps({
    googleMapURL: GOOGLE_MAPS_URL,
    loadingElement: <Loader />,
    containerElement: <div styleName="mapContainer" />,
    mapElement: <div styleName="mapElement"/>,
  }),
  withState('isManualLocationMode', 'setManualLocationMode', false),
  withState('isPlacesSearching', 'setPlacesSearching', false),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        mapBounds: null,
        onMapMounted: ref => {
          refs.map = ref;
          // force map to show current location from the store
          // this is mainly useful during development when using HMR
          if (refs.map && this.props.location && this.props.location.bounds) {
            refs.map.fitBounds(this.props.location.bounds);
          }
        },
        onMapBoundsChanged: () => {
          this.setState({
            mapBounds: refs.map.getBounds(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onSearchBoxInputMounted: ref => {
          refs.searchBoxInput = ref;
        },
        onMapClick: (evt) => {
          if (!this.props.isManualLocationMode) {
            return;
          }

          const center = evt.latLng;
          const mapBounds = refs.map.getBounds();
          // find circle which can fit map bounds and after make it smaller using GOLDEN_RATIO
          // this will be the radius of the area which we will analyze around defined location
          const radius = getBoundsMiximalRadius(mapBounds, mapBounds.getCenter()) / GOLDEN_RATIO;

          const locationCircle = new google.maps.Circle({
            center,
            radius,
          });

          this.props.onLocationChanged({
            center,
            bounds: locationCircle.getBounds(),
            radius,
          });

          refs.searchBoxInput.value = `${center.lat().toFixed(COORDINATES_DECIMALS)},${center.lng().toFixed(COORDINATES_DECIMALS)}`
          this.props.setManualLocationMode(false);
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();

          if (places.length === 0) {
            return;
          }

          let center;
          let radius;

          // if we get only one place, use it as our location
          if (places.length === 1) {
            const place = places[0];
            center = place.geometry.location;

            // google also provides viewport - suggested bounds for map
            const viewport = place.geometry.viewport;
            if (viewport) {
              // if we have suggested viewport, then we find a circle, which can fit suggested bounds
              // with the center in the defined location
              radius = getBoundsMiximalRadius(viewport, center);
            } else {
              // sometimes google places api returns a place without suggested viewport
              // in this case set radius optimal for current map bounds
              const mapBounds = refs.map.getBounds();
              radius = getBoundsMiximalRadius(mapBounds, center) / GOLDEN_RATIO;
            }

          // if we get more then one location
          } else {
            // get location as average of latitudes and longitudes
            // this is quite rough, but enough for our needs
            center = new google.maps.LatLng({
              lat: average(places.map(place => place.geometry.location.lat())),
              lng: average(places.map(place => place.geometry.location.lng())),
            });

            const distances = places.map(place => (
              google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, center)
            ));

            // set radius as an average distance between the "center" and points
            radius = average(distances);
          }

          const circle = new google.maps.Circle({ radius, center });
          const bounds = circle.getBounds();
          refs.map.fitBounds(bounds);

          this.props.setPlacesSearching(false);
          this.props.onLocationChanged({ center, bounds, radius });
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <div styleName="container">
    <AdvisorControls {...props} />
    <AdvisorMap {...props} />
  </div>
));

AdvisorMapWithControls.propTypes = {
  placeType: '',
}

AdvisorMapWithControls.propTypes = {
  isLoading: PT.bool,
  location: PT.shape(),
  placeType: PT.string,
  adviceData: PT.shape(),
  onRequestAdvice: PT.func,
  onPlaceTypeChanged: PT.func,
  onLocationChanged: PT.func,
}

export default AdvisorMapWithControls;
