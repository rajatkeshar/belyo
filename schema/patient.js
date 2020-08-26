'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  patient: {
    type: 'object',
      properties: {
        fName: {
          type: "string",
          minLength: 1,
          maxLength: 100
        },
        lName: {
          type: "string",
          minLength: 1,
          maxLength: 100
        },
        email: {
          type: "string",
          maxLength: 256
        },
        phoneNo: {
          type: "number",
          minLength: 10,
          maxLength: 15
        },
        dob: {
          type: "string",
          maxLength: 256
        }
      },
      required: ['fName', 'lName', 'email', 'phoneNo', 'dob', 'sampleCollected']
  }
};
