/**
 * Advisor map component
 *
 * Displays google map and visualize data
 */
import React from 'react';
import PT from 'prop-types';
import {
  GoogleMap,
  Marker,
  Rectangle,
  InfoWindow,
} from "react-google-maps";
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import PlaceMarker from '../PlaceMarker';

// default options for google map
const GOOGLE_MAP_DEFAULTS = {
  center: { lat: 40, lng: -97 },
  zoom: 5,
  options: {
    mapTypeControl: false,
  }
};

// grid size of place marker clustering
const MARKER_CLUSETER_GRID_SIZE = 60;

// options of rectangle which shows bounds of the area
const LOCATION_BOUNDS_RECTANGLE_OPTIONS = {
  clickable: false,
  strokeColor: '#000',
  strokeWeight: 1,
  strokeOpacity: 0.2,
  fillOpacity: 0.1,
};

// options of heatmap which visualize traffic and pedestrian data
const HEATMAP_OPTIONS = {
  radius: 15,
};

const AdvisorMap = (props) => {
  const { adviceData, location, isManualLocationMode, onMapMounted, onMapBoundsChanged, onMapClick } = props;

  return (
    <GoogleMap
      ref={onMapMounted}
      defaultZoom={GOOGLE_MAP_DEFAULTS.zoom}
      defaultCenter={GOOGLE_MAP_DEFAULTS.center}
      onBoundsChanged={onMapBoundsChanged}
      onClick={onMapClick}
      options={{
        ...GOOGLE_MAP_DEFAULTS.options,
        draggableCursor: isManualLocationMode ? 'crosshair' : ''
      }}
    >
      {/* center of location */}
      {location && location.center &&
        <Marker position={location.center} />
      }
      {/* location bounds */}
      {location && location.bounds &&
        <Rectangle bounds={location.bounds} options={LOCATION_BOUNDS_RECTANGLE_OPTIONS} />
      }
      {/* pedestrians heatmap */}
      {adviceData && adviceData.pedestrianLocations &&
        <HeatmapLayer data={adviceData.pedestrianLocations.map((location) => ({
          location: new google.maps.LatLng(location.coordinates),
          weight: location.eventsCount,
        }))} options={HEATMAP_OPTIONS} />
      }
      {/* traffic heatmap */}
      {adviceData && adviceData.trafficLocations &&
        <HeatmapLayer data={adviceData.trafficLocations.map((location) => ({
          location: new google.maps.LatLng(location.coordinates),
          weight: location.eventsCount,
        }))} options={HEATMAP_OPTIONS} />
      }
      {/* places markers */}
      {adviceData && adviceData.places &&
        <MarkerClusterer
          averageCenter
          enableRetinaIcons
          gridSize={MARKER_CLUSETER_GRID_SIZE}
        >
          {adviceData.places.map(place => <PlaceMarker place={place} key={place.place_id} />)}
        </MarkerClusterer>
      }
    </GoogleMap>
  );
};

AdvisorMap.propTypes = {
  adviceData: PT.shape({
    pedestrianLocations: PT.arrayOf(PT.shape()),
    trafficLocations: PT.arrayOf(PT.shape()),
    places: PT.arrayOf(PT.shape()),
  }),
  location: PT.shape({
    center: PT.shape(),
    bounds: PT.shape(),
    radius: PT.number,
  }),
  isManualLocationMode: PT.bool,
  onMapMounted: PT.func,
  onMapBoundsChanged: PT.func,
  onMapClick: PT.func,
};

export default AdvisorMap;
