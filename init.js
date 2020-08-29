const constants = require('./utils/constants.js');
const TransactionTypes = require('./utils/transaction-types.js');

module.exports = async function () {
  console.log('init belshare dapp')

  var contractObjects = {
      registerClinic: {
          type: TransactionTypes.REGISTER_CLINIC,
          name: "registerClinic",
          location: 'clinic.registerClinic'
      },
      initiatePatientRecord: {
          type: TransactionTypes.INITIATE_PATIENT_RECORD,
          name: "initiatePatientRecord",
          location: 'patient.initiatePatientRecord'
      },
      authorizedPatientRecord: {
          type: TransactionTypes.AUTHORIZED_PATIENT_RECORD,
          name: "authorizedPatientRecord",
          location: 'patient.authorizedPatientRecord'
      },
      approvedPatientRecord: {
          type: TransactionTypes.APPROVED_PATIENT_RECORD,
          name: "approvedPatientRecord",
          location: 'patient.approvedPatientRecord'
      },
      mapClinicUser: {
          type: TransactionTypes.MAP_USER,
          name: "mapClinicUser",
          location: 'clinic.mapClinicUser'
      }
  }
  console.log("app: ", app.contract);
  for(i in contractObjects){
      app.registerContract(contractObjects[i].type, contractObjects[i].location);
  }
  app.setDefaultFee(constants.fees.defaultFee, constants.defaultCurrency);

  app.events.on('newBlock', (block) => {
    console.log('new block received', block.height)
  })
}
