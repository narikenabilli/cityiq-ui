/**
 * Loader component
 *
 * Displays loading animation.
 */
import React from 'react';
import './styles.scss';

const Loader = () => (
  <div styleName="loader">
    <div styleName="spinner">
      <div styleName="bounce1"></div>
      <div styleName="bounce2"></div>
      <div styleName="bounce3"></div>
    </div>
  </div>
);

export default Loader;
