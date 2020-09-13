'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  clinic: {
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
        clinicName: {
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
        },
        aadhar: {
          type: "string",
          maxLength: 256
        },
        addressLine1: {
          type: "string",
          maxLength: 256
        },
        addressLine2: {
          type: "string",
          maxLength: 256
        },
        city: {
          type: "string",
          maxLength: 256
        },
        state: {
          type: "string",
          maxLength: 256
        },
        pinCode: {
          type: "string",
          maxLength: 10
        },
        countryCode: {
          type: 'string',
          minLength: 2,
          maxLength: 2
        },
        status: {
          type: "string",
          default: "active",
          enum: ["active", "inactive"]
        }
      },
      required: ['fName', 'lName', 'email', 'phoneNo', 'dob', 'aadhar', 'addressLine1', 'city', 'state', 'countryCode']
  }
};
