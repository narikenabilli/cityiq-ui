/**
 * Helper script which removes all saved advices
 */
/* eslint-disable no-console */

const predixAssetService = require('../services/predix-asset');

console.log('Removing saved advices...');
predixAssetService.removeAssets('advice').then(() => {
  console.log('Advices cleared.');
}).catch((err) => {
  console.error(err);
});
