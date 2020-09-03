module.exports = {
  name: 'levels',
  fields: [
    {
      name: 'clinicId',
      type: 'String',
      length: 256,
      index: true,
    },
    {
      name: 'userEmail',
      type: 'String',
      length: 256,
      index: true
    },
    {
      name: 'role',
      type: 'String',
      length: 256
    },
    {
      name: "certificateType",
      type: "String",
      length: 25
    },
    {
      name: 'level',
      type: 'Number',
      length: 1
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
      type: "String"
    }
  ]
}
