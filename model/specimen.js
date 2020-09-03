module.exports = {
    name: 'specimens',
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
        name: 'authorizerEmail',
        type: 'String',
        length: 256
      },
      {
        name: 'patientEmail',
        type: 'String',
        length: 256
      },
      {
        name: "sampleId",
        type: "String",
        length: 256
      },
      {
        name: "specimenType",
        type: "String",
        length: 256
      },
      {
        name: 'specimenDate',
        type: 'String',
        length: 256
      },
      {
        name: 'resultDate',
        type: 'String',
        length: 256
      },
      {
        name: 'status',
        type: 'String',
        length: 25,
        default: "pending",
        enum: ["initiated", "pending", "authorized", "issued", "rejected"]
      },
      {
        name: 'result',
        type: 'String',
        length: 25,
        default: "Quarantined",
        enum: ["Quarantined", "Quarantined & Positive", "Quarantined & Positive", "Never Tested", "Self Isolated & Negative", "Self Isolated & Positive"]
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
