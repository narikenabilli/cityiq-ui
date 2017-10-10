/**
 * Helper script which shows all saved advices.
 */
/* eslint-disable no-console */

const predixAssetService = require('../services/predix-asset');

console.log('Retrieving saved advices...');
predixAssetService.getAssets('advice').then((res) => {
  console.log(res);
}).catch((err) => {
  console.error(err);
});
