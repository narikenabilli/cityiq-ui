/**
 * Reducer for the "advisor" section of Redux store.
 */

import _ from 'lodash';
import actions from 'actions/advisor';
import { handleActions } from 'redux-actions';

/**
 * Creates a new advisor reducer with the specified initial state.
 *
 * @param  {Object}   initialState
 *
 * @return {Function} Reducer.
 */
function create(initialState) {
  const a = actions.advisor;
  return handleActions({
    [a.setLocation]: (state, action) => ({
      ...state,
      location: action.payload,
    }),
    [a.setPlaceType]: (state, action) => ({
      ...state,
      placeType: action.payload,
    }),
    [a.getAdviceInit]: state => ({
      ...state,
      isLoading: true,
    }),
    [a.getAdviceDone]: (state, action) => ({
      ...state,
      adviceData: action.payload,
      isLoading: false,
    }),
  }, _.defaults(_.clone(initialState) || {}, {
    adviceData: null,
    location: null,
    isLoading: false,
  }));
}

/**
 * The factory creates the new reducer
 *
 * @return {Promise} Resolves to the new reducer.
 */
export function factory() {
  return Promise.resolve(create());
}

/* Default reducer with empty initial state. */
export default create();
