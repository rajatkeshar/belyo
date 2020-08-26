var _ = require('lodash');
var belriumJS = require('belrium-js');
var util = require("../utils/util");
var auth = require("../utils/auth");
var aesUtil = require("../utils/aesUtil");
var httpCall = require('../utils/httpCall.js');
var apiCall = require('../utils/apiCall.js');
var constants = require('../utils/constants.js');
var schema = require('../schema/clinic.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

app.route.put('/clinic/register',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.clinic);
    let countryCode = req.query.countryCode.toUpperCase();
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "clinicmaster" || userInfo.role === "clinicadmin") {
      let issuerInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
      if(issuerInfo.role != "issuer") return { customCode: 1015, message: "issuer not found" };
      let checkClinicInfo = await app.model.Clinic.exists({ clinicName: req.query.clinicName, pinCode: req.query.pinCode});
      if(checkClinicInfo) return { customCode: 1014, message: "clinic already registered"};

      let options = {
          fee: String(constants.fees.registerClinic * constants.fixedPoint),
          type: TransactionTypes.REGISTER_CLINIC,
          args: JSON.stringify([req.query.fName, req.query.lName, req.query.clinicName, req.query.email, req.query.phoneNo, req.query.dob, req.query.aadhar, req.query.addressLine1, req.query.addressLine2, req.query.city, req.query.pinCode, req.query.state, req.query.countryCode])
      };

      let decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);

      let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
      let dappId = util.getDappID();
      let params = {
          transaction: transaction
      };

      console.log("registerClinic data: ", params);
      try {
        let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
        return res;
      } catch (e) {
        return {customCode: 3001, message: "something went wrong!"}
      }
    } else {
      return { customCode: 4013, message: "not authorized to add clinic info" };
    }
});

app.route.post('/clinic',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.Clinic.count({ email: req.query.email});
    let clinicsInfo = await app.model.Clinic.findAll({ offset: offset, limit: limit, condition: { email: req.query.email} });

    return {data: clinicsInfo, total: count};
});
