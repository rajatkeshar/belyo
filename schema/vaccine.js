'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  vaccine: {
    type: 'object',
      properties: {
        clinicId: {
          type: "string",
          maxLength: 256
        },
        certificateType: {
          type: "string",
          maxLength: 256
        },
        patientEmail: {
          type: "string",
          maxLength: 256
        },
        vaccineName: {
          type: "string",
          maxLength: 256
        },
        vaccineOn: {
          type: "string",
          maxLength: 256
        },
        validTillDate: {
          type: "string",
          maxLength: 256
        },
        vaccinatedBy: {
          type: "string",
          maxLength: 256
        },
        vaccinatedAt: {
          type: "string",
          maxLength: 256
        }
      },
      required: ['clinicId', 'certificateType', 'patientEmail', 'vaccineName', 'vaccineOn', 'validTillDate', 'vaccinatedBy', 'vaccinatedAt']
  }
};
