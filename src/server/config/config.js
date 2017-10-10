/**
 * This module defines the settings that need to be configured for a new
 * environment.
 */
const config = {
  logLevel: process.env.NODE_ENV === 'development' ? 'verbose' : 'info',

  predix: {
    uaaUrl: '',
    clientId: '',
    clientSecret: '',
    apiUrl: '',
    zoneId: '',
  },

  google: {
    places: {
      apiUrl: 'https://maps.googleapis.com/maps/api/place',
      key: '',
    },
  },

  /* these configuration values were provided during challenge */
  cityiq: {
    metadataUrl: 'https://ic-metadata-service.run.aws-usw02-pr.ice.predix.io/v2/metadata',
    eventUrl: 'https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2',
    uaaUrl: 'https://890407d7-e617-4d70-985f-01792d693387.predix-uaa.run.aws-usw02-pr.ice.predix.io',
    clientId: 'hackathon',
    clientSecret: '@hackathon',
    predixZoneIds: {
      traffic: 'SDSIM-IE-TRAFFIC',
      pedestrian: 'SDSIM-IE-PEDESTRIAN',
    },
  },
};

module.exports = config;
