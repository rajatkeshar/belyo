'use strict';

var constants = require('../utils/constants.js');

module.exports = {
  clinic: {
    type: 'object',
      properties: {
        fname: {
          type: "string",
          minLength: 1,
          maxLength: 100
        },
        lname: {
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
          minLength: 10,
          maxLength: 10
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
        }
      },
      required: ['fname', 'lname', 'email', 'phoneNo', 'dob', 'aadhar', 'addressLine1', 'city', 'state', 'countryCode']
  },
  verifyBelShare: {
    type: 'object',
      properties: {
        password: {
          type: "string",
          minLength: 1,
          maxLength: 100
        },
        phoneNo: {
          type: "number",
          minLength: 10,
          maxLength: 10
        }
      },
      required: ['phoneNo', 'password']
  }
};
