module.exports = {
    name: 'clinics',
    fields: [
      {
        name: 'fName',
        type: 'String',
        length: 256,
        index: true,
      },
      {
        name: 'lName',
        type: 'String',
        length: 256,
        index: true,
      },
      {
        name: 'clinicName',
        type: 'String',
        length: 256,
        index: true,
      },
      {
        name: 'email',
        type: 'String',
        length: 256,
        index: true
      },
      {
        name: 'phoneNo',
        type: 'Number'
      },
      {
        name: 'dob',
        type: 'String',
        length: 256
      },
      {
        name: 'aadhar',
        type: 'String',
        length: 256
      },
      {
        name: 'addressLine1',
        type: 'String',
        length: 256
      },
      {
        name: 'addressLine2',
        type: 'String',
        length: 256
      },
      {
        name: 'city',
        type: 'String',
        length: 256
      },
      {
        name: 'pinCode',
        type: 'String',
        length: 256
      },
      {
        name: 'state',
        type: 'String',
        length: 256
      },
      {
        name: 'countryCode',
        type: 'String',
        length: 2
      },
      {
        name: 'status',
        type: 'String',
        length: 25,
        default: "approved",
        enum: ["pending", "approved"]
      },
      {
        name: 'timestamp',
        type: 'Number'
      },
      {
        name: 'transactionId',
        length: 256,
        type: "String"
      }
    ]
  }
