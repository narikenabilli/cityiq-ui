/**
 * Entry point for application
 *
 * Take care about global stuff
 *  - global components
 *  - global styles
 *  - import global fetch polyfill
 */

import React from 'react';
import Routes from 'routes';
import ReduxToastr from 'react-redux-toastr';
import 'whatwg-fetch';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './styles/global.scss';

export default function App() {
  return (
    <div>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="top-center"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
      />
      <Routes />
    </div>
  );
}
