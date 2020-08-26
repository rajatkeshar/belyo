module.exports = {
    name: 'patients',
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
        name: 'issuerEmail',
        type: 'String',
        length: 256
      },
      {
        name: 'authorizerEmail',
        type: 'String',
        length: 256
      },
      {
        name: 'email',
        type: 'String',
        length: 256
      },
      {
        name: 'phoneNo',
        type: 'Number',
        length: 15,
        index: true
      },
      {
        name: 'dob',
        type: 'String',
        length: 256
      },
      {
        name: 'sampleCollected',
        type: 'Boolean',
        default: true
      },
      {
        name: 'report',
        type: 'String',
        length: 25,
        default: "initiated",
        enum: ["initiated", "pending", "authorized", "approved"]
      },
      {
        name: 'result',
        type: 'String',
        length: 25,
        default: "pending",
        enum: ["pending", "positive", "negative"]
      },
      {
        name: 'cOn',
        type: 'Number'
      },
      {
        name: 'mOn',
        type: 'Number'
      },
      {
        name: 'timestamp',
        type: 'Number'
      },
      {
        name: 'transactionId',
        length: 256,
        type: 'String'
      }
    ]
  }
