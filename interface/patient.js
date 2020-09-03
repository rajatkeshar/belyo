var _ = require('lodash');
var belriumJS = require('belrium-js');
var util = require("../utils/util");
var auth = require("../utils/auth");
var aesUtil = require("../utils/aesUtil");
var httpCall = require('../utils/httpCall.js');
var apiCall = require('../utils/apiCall.js');
var constants = require('../utils/constants.js');
var addressHelper = require('../utils/address.js');
var vaccineSchema = require('../schema/vaccine.js');
var specimenSchema = require('../schema/specimen.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');
const CertificateType = ["covid", "vaccination"];

app.route.put('/issuer/initiate/patient/record',  async function (req) {
    if(!_.includes(CertificateType, req.query.certificateType)) return {customCode: 4019, message: "invalid certificateType"};
    if(req.query.certificateType === "covid"){
      let validateSchema = await z_schema.validate(req.query, specimenSchema.specimen);
      let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
      if(userInfo.role === "clinicissuer") {
        // let patientInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
        // if(patientInfo.customCode) return { customCode: 4005, message: "user does not exists"};
        let checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: userInfo.email});
        if(!checkMappingInfo) return { customCode: 1017, message: "issuer not found for this clinic"};

        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.INITIATE_COVID_CERT,
            args: JSON.stringify([req.query.clinicId, req.query.certificateType, userInfo.email, req.query.patientEmail, req.query.sampleId, req.query.specimenType, req.query.specimenDate, req.query.resultDate, req.query.result])
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
    } else {
      let validateSchema = await z_schema.validate(req.query, vaccineSchema.vaccine);
      let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
      if(userInfo.role === "clinicissuer") {
        // let patientInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
        // if(patientInfo.customCode) return { customCode: 4005, message: "user does not exists"};
        let checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: userInfo.email});
        if(!checkMappingInfo) return { customCode: 1017, message: "issuer not found for this clinic"};

        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.INITIATE_VACCINE_CERT,
            args: JSON.stringify([req.query.clinicId, req.query.certificateType, userInfo.email, req.query.patientEmail, req.query.vaccineName, req.query.vaccineOn, req.query.validTillDate, req.query.vaccinatedBy, req.query.vaccinatedAt])
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
    }
});

app.route.put('/authorizer/authorized/patient/record',  async function (req) {
    if(req.query.certificateType == "covid") {
      let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
      if(userInfo.role === "clinicauthorizer") {
        let checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: userInfo.email});
        console.log("checkMappingInfo: ", checkMappingInfo);
        if(!checkMappingInfo) return { customCode: 1017, message: "authorizer not found for this clinic"};
        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.AUTHORIZED_PATIENT_RECORD,
            args: JSON.stringify([req.query.certificateType, req.query.trsId, userInfo.email, req.query.status])
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
    } else {
      let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
      if(userInfo.role === "clinicauthorizer") {
        let checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: userInfo.email});
        if(!checkMappingInfo) return { customCode: 1017, message: "issuer not found for this clinic"};

        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.AUTHORIZED_PATIENT_RECORD,
            args: JSON.stringify([req.query.certificateType, req.query.trsId, userInfo.email, req.query.status])
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
    }
});

app.route.put('/issuer/approved/patient/record',  async function (req) {
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "clinicissuer") {
      let checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: userInfo.email});
      if(!checkMappingInfo) return { customCode: 1017, message: "issuer not found for this clinic"};

      let options = {
          fee: String(constants.fees.defaultFee * constants.fixedPoint),
          type: TransactionTypes.APPROVED_PATIENT_RECORD,
          args: JSON.stringify([req.query.certificateType, req.query.trsId, req.query.status])
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
      condition.status = req.query.status;
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
