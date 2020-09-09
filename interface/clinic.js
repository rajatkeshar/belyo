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
const CertificateType = ["covid", "vaccination"];

app.route.put('/clinic/register',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.clinic);
    let countryCode = req.query.countryCode.toUpperCase();
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin") {
      let clinicUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
      //if(clinicUserInfo.role == "clinicmaster" || clinicUserInfo.role == "clinicadmin") {
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
      // } else {
      //   return { customCode: 1015, message: "clinic can not be added to this role" };
      // }
    } else {
      return { customCode: 4013, message: "not authorized to add clinic info" };
    }
});

app.route.put('/clinic/update/clinicmaster',  async function (req) {
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.query.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin") {
      let recipientUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
      if(recipientUserInfo.role == "clinicmaster") {
        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.UPDATE_CLINIC_MASTER,
            args: JSON.stringify([req.query.clinicId, req.query.email])
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
        return { customCode: 1018, message: "user can not be mapped" };
      }
    } else {
      return { customCode: 4013, message: "not authorized to add clinic info" };
    }
});

app.route.put('/clinic/map/users',  async function (req) {
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.query.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin" || userInfo.role === "clinicmaster" || userInfo.role === "clinicadmin") {
      let recipientUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
      if(recipientUserInfo.role == "clinicmaster" || recipientUserInfo.role == "clinicissuer" || recipientUserInfo.role == "clinicauthorizer") {
        let checkMappingInfo = await app.model.ClinicUser.exists({ userEmail: req.query.email});
        if(checkMappingInfo) return { customCode: 1017, message: "user already registered"};

        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.MAP_USER,
            args: JSON.stringify([req.query.clinicId, req.query.loginEmail, req.query.email, recipientUserInfo.role])
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
        return { customCode: 1018, message: "user can not be mapped" };
      }
    } else {
      return { customCode: 4013, message: "not authorized to add clinic info" };
    }
});

app.route.put('/clinic/delete/:clinicId',  async function (req) {
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.params.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin") {
        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.DELETE_CLINIC,
            args: JSON.stringify([req.params.clinicId])
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
      return { customCode: 4013, message: "not authorized to delete clinic info" };
    }
});

app.route.put('/clinic/map/auth/levels',  async function (req) {
    if(!_.includes(CertificateType, req.query.certificateType)) return {customCode: 4019, message: "invalid certificateType"};
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.query.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "clinicmaster" || userInfo.role === "clinicadmin") {
      // let recipientUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
      // if(recipientUserInfo.role == "clinicissuer" || recipientUserInfo.role == "clinicauthorizer") {
        if(req.query.certificateType === "covid") {
          var checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: req.query.issuerEmail, userEmail: req.query.authorizer1Email});
          if(!checkMappingInfo) return { customCode: 1017, message: "users does satisfying clinic users role"};
        }
        if(req.query.certificateType === "vaccination") {
          var checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: req.query.issuerEmail, userEmail: req.query.authorizer1Email, userEmail: req.query.authorizer2Email});
          if(!checkMappingInfo) return { customCode: 1017, message: "users does satisfying clinic users role"};
        }

        // var checkLevelInfo = await app.model.Level.exists({ issuerEmail: req.query.issuerEmail, certificateType: req.query.certificateType});
        // if(checkLevelInfo) return { customCode: 1017, message: "issuer level info already registered"};
        //
        // var checkLevelInfo = await app.model.Level.exists({ authorizer1Email: req.query.authorizer1Email, certificateType: req.query.certificateType});
        // if(checkLevelInfo) return { customCode: 1017, message: "authorizer1 level info already registered"};
        //
        // var checkLevelInfo = await app.model.Level.exists({ authorizer2Email: req.query.authorizer2Email, certificateType: req.query.certificateType});
        // if(checkLevelInfo) return { customCode: 1017, message: "authorizer2 level info already registered"};

        req.query.authorizer2Email = (req.query.authorizer2Email)? req.query.authorizer2Email: null;
        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.MAP_USER_LEVEL,
            args: JSON.stringify([req.query.clinicId, req.query.issuerEmail, req.query.authorizer1Email, req.query.authorizer2Email, req.query.certificateType])
        };

        let decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);

        let transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
        let dappId = util.getDappID();
        let params = {
            transaction: transaction
        };

        console.log("registerLevel data: ", params);
        try {
          let res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
          return res;
        } catch (e) {
          return {customCode: 3001, message: "something went wrong!"}
        }
      // } else {
      //   return { customCode: 1018, message: "user can not be mapped" };
      // }
    } else {
      return { customCode: 4013, message: "not authorized to add level info" };
    }
});

app.route.post('/clinic',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.Clinic.count({ _deleted_: 0 });
    let clinicsInfo = await app.model.Clinic.findAll({ offset: offset, limit: limit, condition: { _deleted_: 0} });

    return {data: clinicsInfo, total: count};
});

app.route.post('/clinicUsers/:id',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.ClinicUser.count({ clinicId: req.params.id});
    let clinicsInfo = await app.model.ClinicUser.findAll({ offset: offset, limit: limit, condition: { clinicId: req.params.id} });

    return {data: clinicsInfo, total: count};
});
