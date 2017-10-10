/**
 * Application routes
 */
import React from 'react';
import { Route } from 'react-router-dom';

import Advisor from 'containers/Advisor';

const Routes = () => (
  <div>
    <Route exact path="/" component={Advisor} />
  </div>
);

export default Routes;
