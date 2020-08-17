module.exports = {
    name: 'clinic',
    fields: [
      {
        name: 'fname',
        type: 'String',
        length: 256,
        not_null: true,
        index: true,
      },
      {
        name: 'lname',
        type: 'String',
        length: 256,
        not_null: true,
        index: true,
      },
      {
        name: 'clinicName',
        type: 'String',
        length: 256,
        not_null: true,
        index: true,
      },
      {
        name: 'email',
        type: 'String',
        length: 256,
        not_null: true,
        index: true
      },
      {
        name: 'phoneNo',
        type: 'Number',
        length: 10,
        not_null: true,
        index: true
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
      }
    ]
  }
