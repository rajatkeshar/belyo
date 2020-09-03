'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  specimen: {
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
        sampleId: {
          type: "string",
          maxLength: 256
        },
        specimenType: {
          type: "string",
          maxLength: 256
        },
        specimenDate: {
          type: "string",
          maxLength: 256
        },
        resultDate: {
          type: "string",
          maxLength: 256
        },
        result: {
          type: "string",
          maxLength: 256,
          default: "Quarantined",
          enum: ["Quarantined", "Quarantined & Positive", "Quarantined & Negative", "Never Tested", "Self Isolated & Negative", "Self Isolated & Positive"]
        }
      },
      required: ['clinicId', 'certificateType', 'patientEmail', 'sampleId', 'result']
  }
};
