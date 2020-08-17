const constants = require('./utils/constants.js');
const TransactionTypes = require('./utils/transaction-types.js');

module.exports = async function () {
  console.log('init belshare dapp')

  var contractObjects = {
      registerClinic: {
          type: TransactionTypes.REGISTER_CLINIC,
          name: "registerClinic",
          location: 'clinic.registerClinic'
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
