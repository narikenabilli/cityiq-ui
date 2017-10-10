/**
 * This module contains the root reducer factory
 */

import { reducer as toastrReducer } from 'react-redux-toastr';
import { combine, resolveReducers } from 'utils/redux';

import { factory as advisorFactory } from './advisor';

export function factory() {
  return resolveReducers({
    advisor: advisorFactory(),
  }).then(reducers => combine(
    {
      ...reducers,
      toastr: toastrReducer,
    }
  ));
}

export default undefined;
