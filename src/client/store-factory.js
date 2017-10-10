/**
 * This module provides Redux store factory.
 */

/* Conditional requires are absolutely necessary in this module. */
/* eslint-disable global-require */

import promiseMiddleware from 'redux-promise';
import { applyMiddleware, compose, createStore } from 'redux';
import { factory as reducerFactory } from './reducers';

let enhancer = applyMiddleware(promiseMiddleware);

if (process.env.NODE_ENV === 'development') {
  const reduxLogger = require('redux-logger').createLogger({ collapsed: true });
  enhancer = compose(enhancer, applyMiddleware(reduxLogger));
}

/**
 * Creates Redux store.
 *
 * @param {Object} initialState Optional. If provided, it is assigned to be
 *    the initial state of the store.
 *
 * @return {Promise}            Resolves into new Redux store.
 */
export default function storeFactory(initialState) {
  return new Promise((resolve) => {
    reducerFactory().then((reducer) => {
      const store = createStore(reducer, initialState || {}, enhancer);
      if (module.hot) {
        module.hot.accept('./reducers', () => {
          require('./reducers').factory()
            .then(newReducer => store.replaceReducer(newReducer));
        });
      }
      resolve(store);
    });
  });
}
