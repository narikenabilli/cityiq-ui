/**
 * Container for advisor section
 *
 * Connects AdvisorMapWithControls to redux store
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import AdvisorMapWithControls from 'components/AdvisorMapWithControls';
import Loader from 'components/Loader';
import actions from 'actions/advisor';

const Advisor = (props) => {
  const { isLoading, location, placeType, adviceData,
    setLocation, setPlaceType, getAdvice } = props;

  return (
    <div>
      {isLoading && <Loader />}

      <AdvisorMapWithControls {...{
        isLoading,
        location,
        placeType,
        adviceData,
        onLocationChanged: setLocation,
        onPlaceTypeChanged: setPlaceType,
        onRequestAdvice: getAdvice,
      }} />
    </div>
  );
};

Advisor.defaultProps = {
  placeType: '',
};

Advisor.propTypes = {
  isLoading: PT.bool,
  location: PT.shape(),
  placeType: PT.string,
  adviceData: PT.shape(),
  getAdvice: PT.func,
  setPlaceType: PT.func,
  setLocation: PT.func,
};

const mapStateToProps = state => ({
  isLoading: state.advisor.isLoading,
  location: state.advisor.location,
  placeType: state.advisor.placeType,
  adviceData: state.advisor.adviceData,
});

const mapDispatchToProps = dispatch => ({
  getAdvice: (data) => {
    if (!data.placeType) {
      toastr.warning('Please, select place type.');
      return;
    }

    if (!data.location) {
      toastr.warning('Please, choose location.');
      return;
    }

    dispatch(actions.advisor.getAdviceInit());
    dispatch(actions.advisor.getAdviceDone(data));
  },
  setPlaceType: (placeType) => {
    dispatch(actions.advisor.setPlaceType(placeType));
  },
  setLocation: (location) => {
    dispatch(actions.advisor.setLocation(location));
  },
});

const AdvisorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Advisor);

export default AdvisorContainer;
