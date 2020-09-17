module.exports = {
    name: 'clinics',
    fields: [
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
        name: 'identity',
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
        default: "active",
        enum: ["active", "inactive"]
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
