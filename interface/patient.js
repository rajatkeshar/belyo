var _ = require('lodash');
var belriumJS = require('belrium-js');
var util = require("../utils/util");
var auth = require("../utils/auth");
var aesUtil = require("../utils/aesUtil");
var httpCall = require('../utils/httpCall.js');
var apiCall = require('../utils/apiCall.js');
var constants = require('../utils/constants.js');
var schema = require('../schema/patient.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');

app.route.put('/issuer/initiate/patient/record',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.patient);
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "issuer") {
      let patientInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});

      if(patientInfo.customCode) return { customCode: 4005, message: "user does not exists"};
      let options = {
          fee: String(constants.fees.initiatePatientRecord * constants.fixedPoint),
          type: TransactionTypes.INITIATE_PATIENT_RECORD,
          args: JSON.stringify([req.query.fName, req.query.lName, userInfo.email, req.query.email, req.query.phoneNo, req.query.dob])
      };

      let decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);
      let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
      let dappId = util.getDappID();
      let params = {
          transaction: transaction
      };

      console.log("initiate patient record: ", params);
      try {
        let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
        return res;
      } catch (e) {
        return {customCode: 3001, message: "something went wrong!"}
      }
    } else {
      return { customCode: 4014, message: "not authorized to process patient record" };
    }
});

app.route.put('/authorizer/authorized/patient/record',  async function (req) {
    req.query.report = "authorized";
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "authorizer") {
      let options = {
          fee: String(constants.fees.authorizedPatientRecord * constants.fixedPoint),
          type: TransactionTypes.AUTHORIZED_PATIENT_RECORD,
          args: JSON.stringify([req.query.trsId, userInfo.email, req.query.report, req.query.result])
      };

      let decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);
      let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
      let dappId = util.getDappID();
      let params = {
          transaction: transaction
      };

      console.log("authorized patient record: ", params);
      try {
        let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
        return res;
      } catch (e) {
        return {customCode: 3001, message: "something went wrong!"}
      }
    } else {
      return { customCode: 4014, message: "not authorized to process patient record" };
    }
});

app.route.put('/issuer/approved/patient/record',  async function (req) {
    req.query.report = "approved";
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "issuer") {
      let options = {
          fee: String(constants.fees.approvedPatientRecord * constants.fixedPoint),
          type: TransactionTypes.APPROVED_PATIENT_RECORD,
          args: JSON.stringify([req.query.trsId, req.query.report])
      };

      let decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);
      let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
      let dappId = util.getDappID();
      let params = {
          transaction: transaction
      };

      console.log("approved patient record: ", params);
      try {
        let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
        return res;
      } catch (e) {
        return {customCode: 3001, message: "something went wrong!"}
      }
    } else {
      return { customCode: 4014, message: "not authorized to process patient record" };
    }
});

app.route.post('/patient/record',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let condition = {};
    if(req.query.reportStatus) {
      condition.report = req.query.reportStatus;
    }
    if(req.query.email) {
      condition.email = req.query.email;
    }
    if(req.query.issuerEmail) {
      condition.issuerEmail = req.query.issuerEmail;
    }
    if(req.query.authorizerEmail) {
      condition.authorizerEmail = req.query.authorizerEmail;
    }
    let count = await app.model.Patient.count(condition);
    let patientInfo = await app.model.Patient.findAll({ condition: condition, offset: offset, limit: limit });

    return {data: patientInfo, total: count};
});
