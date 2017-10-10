/**
 * Advisor map controls component
 *
 * Displays form to make a request with place type and location fields
 */
import React from 'react';
import PT from 'prop-types';
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import googlePlacesTypes from '../helpers/google-places-types';
import './style.scss';

const AdvisorControls = (props) => {
  const { location, placeType, onSearchBoxMounted, mapBounds, onPlacesChanged,
    onSearchBoxInputMounted, isManualLocationMode, isLoading, setPlacesSearching, isPlacesSearching} = props;

  return (
    <div styleName="controls">
      <label htmlFor="placeType" styleName="label">Place type</label>
      <select
        id="placeType"
        styleName="select"
        onChange={(evt) => props.onPlaceTypeChanged(evt.target.value)}
        value={placeType || ''}
        disabled={isLoading}
      >
        <option disabled value="">Select place type</option>
        {googlePlacesTypes.map(type => (<option value={type.value} key={type.value}>{type.text}</option>))}
      </select>

      <label htmlFor="location" styleName="label">Location</label>
      <div styleName="locationWrap">
        <StandaloneSearchBox
          ref={onSearchBoxMounted}
          bounds={mapBounds}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            id="location"
            ref={onSearchBoxInputMounted}
            type="text"
            placeholder="Search for location"
            styleName="searchBox"
            disabled={isLoading}
            onKeyDown={(evt) => {
              if (evt.target.value.trim().length > 0 && evt.keyCode === 13) {
                setPlacesSearching(true);
              }
            }}
          />
        </StandaloneSearchBox>
        {!isPlacesSearching ? (
          <button
            onClick={(evt) => {
              evt.preventDefault();
              props.setManualLocationMode(!isManualLocationMode);
            }}
            styleName={`locationButton ${isManualLocationMode && 'active'}`}
            tabIndex="-1"
            disabled={isLoading}
            title="Click to choose location on the map manually."
          >
            <i></i>
          </button>
        ) : (
          <div styleName="spinner">
            <div styleName="double-bounce1"></div>
            <div styleName="double-bounce2"></div>
          </div>
        )}
      </div>

      <button
        styleName={`analyzeButton ${location && placeType && 'active'}`}
        onClick={(evt) => {
          evt.preventDefault();
          props.onRequestAdvice({ location, placeType });
        }}
        disabled={isLoading}
      >
        Analyze
      </button>
    </div>
  );
};

AdvisorControls.propTypes = {
  isLoading: PT.bool,
  location: PT.shape(),
  placeType: PT.string,
  mapBounds: PT.shape(),
  isManualLocationMode: PT.bool,
  isPlacesSearching: PT.bool,
  onSearchBoxMounted: PT.func,
  onPlacesChanged: PT.func,
  onSearchBoxInputMounted: PT.func,
  setPlacesSearching: PT.func,
};

export default AdvisorControls;
