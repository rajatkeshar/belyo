module.exports = {
    name: 'vaccines',
    fields: [
      {
        name: 'clinicId',
        type: 'String',
        length: 256,
        index: true,
      },
      {
        name: "certificateType",
        type: "String",
        length: 25
      },
      {
        name: 'issuerEmail',
        type: 'String',
        length: 256
      },
      {
        name: 'authorizer1Email',
        type: 'String',
        length: 256
      },
      {
        name: 'authorizer2Email',
        type: 'String',
        length: 256
      },
      {
        name: 'patientEmail',
        type: 'String',
        length: 256
      },
      {
        name: 'status',
        type: 'String',
        length: 25,
        default: "pending",
        enum: ["initiated", "pending", "authorized1", "authorized2", "issued", "rejected"]
      },
      {
        name: "vaccineName",
        type: "String",
        length: 256
      },
      {
        name: 'vaccineOn',
        type: 'String',
        length: 50
      },
      {
        name: 'validTillDate',
        type: 'String',
        length: 50
      },
      {
        name: 'vaccinatedBy',
        type: 'String',
        length: 256
      },
      {
        name: 'vaccinatedAt',
        type: 'String',
        length: 25
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
        name: 'transactionId',
        length: 256,
        type: 'String'
      }
    ]
  }
