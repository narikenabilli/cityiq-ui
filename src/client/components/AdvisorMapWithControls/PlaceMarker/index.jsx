/**
 * Place marker component
 *
 * Displays place marker and shows its information on marker click
 */
import React from 'react';
import PT from 'prop-types';
import {
  Marker,
  InfoWindow,
} from "react-google-maps";
import { compose, withState } from "recompose";

// place marker options
const PLACE_MARKER_ICON = {
  // path we set in render function to make sure google library is loaded
  // path: google.maps.SymbolPath.CIRCLE,
  scale: 10,
  fillOpacity: 1,
  fillColor: '#00f',
  strokeColor: '#fff',
  strokeWeight: 1,
};

// options for info window
const INFO_WINDOW_OPTIONS = {
  disableAutoPan: true,      // disable auto pan to avoid loop map adjustments
}

const PlaceMarker = ({ place, isOpen, setOpen }) => (
  <Marker
    position={place.geometry.location}
    icon={{
      ...PLACE_MARKER_ICON,
      path: google.maps.SymbolPath.CIRCLE,
    }}
    onClick={() => {
      setOpen(!isOpen);
    }}
  >
    { isOpen &&
      <InfoWindow
        options={INFO_WINDOW_OPTIONS}
        onCloseClick={() => {
          setOpen(!isOpen);
        }}
      >
        <div>
          <div><strong>{place.name}</strong></div>
          <div>{place.vicinity}</div>
          <div>rating: {place.rating}</div>
        </div>
      </InfoWindow>
    }
  </Marker>
);

PlaceMarker.propTypes = {
  place: PT.shape(),
  isOpen: PT.bool,
  setOpen: PT.func,
};

export default compose(
  withState('isOpen', 'setOpen', false),
)(PlaceMarker);
