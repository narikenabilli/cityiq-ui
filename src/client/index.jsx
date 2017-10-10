/**
 * Setup react application
 *
 *  - create store
 *  - initiate router
 *  - render react application
 */

import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, browserHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import storeFactory from './store-factory';

/**
 * Render react application to the #root element
 *
 * @param {Object} store redux store
 */
const renderApp = (store) => {
  const App = require('./app').default; // eslint-disable-line global-require

  ReactDom.render(
    <Provider store={store}>
      <BrowserRouter history={browserHistory}>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
  );
};

storeFactory().then((store) => {
  // support hot module reloading
  if (module.hot) {
    module.hot.accept('./app', () => {
      renderApp(store);
    });

    /* This block of code forces reloading of styles.css file each time
     * webpack hot middleware reports about update of the code. */
    /* eslint-disable no-underscore-dangle */
    const hotReporter = window.__webpack_hot_middleware_reporter__;
    const hotSuccess = hotReporter.success;
    hotReporter.success = () => {
      const stamp = `${(new Date()).getTime()}${Math.random()}`;
      const links = document.querySelectorAll('link[rel=stylesheet]');
      for (let i = 0; i < links.length; i += 1) {
        const match = links[i].href.match(/styles.css[^?]*/);
        if (match) {
          links[i].href = `${match[0]}?v=${stamp}`;
        }
      }
      hotSuccess();
    };
  }

  renderApp(store);
});

