/**
 * Redux-related helpers.
 */

import _ from 'lodash';

/**
 * Given a mapping between reducer names and their promises, this function
 *    waits till resolution of all promises and returns the mapping between
 *    reducer names and the resolved reducers.
 *
 * @param {Object} promises Object with promises of reducers.
 *
 * @return {Promise}        Resolves to object with reducers.
 */
export function resolveReducers(promises) {
  return Promise.all(_.values(promises)).then((reducers) => {
    const map = {};
    _.keys(promises).forEach((key, index) => {
      map[key] = reducers[index];
    });
    return map;
  });
}

/**
 * Reduce multiple reducers into a single reducer from left to right.
 *    Function-type reducers will be called directly with current state, and
 *    action Object type reducers (eg: `{submissions: (state, action) => {}}`)
 *    will be called with the state's slice corresponding to object's key eg:
 *    `{submissions}` will be called with `submissions(state.submissions,
 *    action)`
 *
 * @params {function|Object} ...reducers the reducers to be combined
 *
 * @return {function}                    the unified reducer
 */
export function combine(...reducers) {
  return (state, action) => {
    const nextState = {};
    const mergeState = Object.assign.bind(Object, nextState);

    reducers.forEach((reducer) => {
      if (typeof reducer === 'function') {
        return mergeState(reducer(state, action));
      }

      _.keys(reducer).forEach((slice) => {
        mergeState({ [slice]: reducer[slice]((state || {})[slice], action) });
      });
      return undefined;
    });

    return nextState;
  };
}

/* We don't have any `main` function in this module to export it by default. */
export default undefined;
