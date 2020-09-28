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
const ClinicStatus = ["active", "inactive"];

app.route.put('/clinic/register',  async function (req) {
    let validateSchema = await z_schema.validate(req.query, schema.clinic);
    let countryCode = (req.query.countryCode)? req.query.countryCode.toUpperCase(): null;
    let dappId = util.getDappID();
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin") {
      //let clinicUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});
      let recipientUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.clinicMasterEmail, dappName: app.config.dappName});
      if(recipientUserInfo.role == "clinicmaster") {
        try {
          let checkClinicInfo = await app.model.Clinic.exists({ clinicName: req.query.clinicName, pinCode: req.query.pinCode});
          if(checkClinicInfo) return { customCode: 1014, message: "clinic already registered"};

          var options = {
              fee: String(constants.fees.registerClinic * constants.fixedPoint),
              type: TransactionTypes.REGISTER_CLINIC,
              args: JSON.stringify([req.query.clinicName, req.query.email, req.query.phoneNo, req.query.identity, req.query.addressLine1, req.query.addressLine2, req.query.city, req.query.pinCode, req.query.state, req.query.countryCode])
          };

          var decryptedSecret = aesUtil.decrypt(userInfo.secret, constants.cipher.key);

          var transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
          var params = {
              transaction: transaction
          };

          console.log("registerClinic data: ", params);
          var res = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
          console.log("res: ", res);
          var options = {
              fee: String(constants.fees.defaultFee * constants.fixedPoint),
              type: TransactionTypes.MAP_USER,
              args: JSON.stringify([res.transactionId, req.query.loginEmail, req.query.clinicMasterEmail, recipientUserInfo.role])
          };

          var decryptedSecret = aesUtil.decrypt(recipientUserInfo.secret, constants.cipher.key);

          var transaction = belriumJS.dapp.createInnerTransaction(options, decryptedSecret);
          var params = {
              transaction: transaction
          };
          var res2 = await httpCall.call('PUT', `/api/dapps/${dappId}/transactions/signed`, params);
          return res;
        } catch (e) {
          console.log("err: ", e);
          return {customCode: 3001, message: "something went wrong!"}
        }
      } else {
        return { customCode: 1013, message: "incorrect recipient user role: " +  recipientUserInfo.role};
      }
    } else {
      return { customCode: 4015, message: "incorrect user role to process clinic info" };
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
        return { customCode: 1013, message: "incorrect recipient user role: " +  recipientUserInfo.role };
      }
    } else {
      return { customCode: 4015, message: "incorrect user role to process clinic info" };
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
        if(checkMappingInfo) return { customCode: 4010, message: "user already registered"};

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
        return { customCode: 1013, message: "incorrect recipient user role: " + recipientUserInfo.role };
      }
    } else {
      return { customCode: 4015, message: "incorrect user role to process clinic info" };
    }
});

app.route.put('/clinic/update/users/status',  async function (req) {
    if(!_.includes(ClinicStatus, req.query.status)) return {customCode: 4022, message: "invalid status"};
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.query.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    if(clinicsInfo.status === "inactive" && req.query.status === "active") return {customCode: 4020, message: "clinic is inactive"};

    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin" || userInfo.role === "clinicmaster" || userInfo.role === "clinicadmin") {
      let recipientUserInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.email, dappName: app.config.dappName});

      let checkMappingInfo = await app.model.ClinicUser.exists({ userEmail: req.query.userEmail});
      if(!checkMappingInfo) return { customCode: 4017, message: "user is not the member of clinic"};

      let options = {
          fee: String(constants.fees.defaultFee * constants.fixedPoint),
          type: TransactionTypes.UPDATE_CLINIC_USER_STATUS,
          args: JSON.stringify([req.query.clinicId, req.query.userEmail, req.query.status])
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
      return { customCode: 4015, message: "incorrect user role to process clinic info" };
    }
});

app.route.put('/clinic/update/status/:clinicId',  async function (req) {
    if(!_.includes(ClinicStatus, req.query.status)) return {customCode: 4022, message: "invalid status"};
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.params.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "superadmin" || userInfo.role === "miniadmin") {
        let options = {
            fee: String(constants.fees.defaultFee * constants.fixedPoint),
            type: TransactionTypes.UPDATE_CLINIC_STATUS,
            args: JSON.stringify([req.params.clinicId, req.query.status])
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
      return { customCode: 4013, message: "incorrect user role to process clinic info" };
    }
});

app.route.put('/clinic/map/auth/levels',  async function (req) {
    if(!_.includes(CertificateType, req.query.certificateType)) return {customCode: 4019, message: "invalid certificateType"};
    let clinicsInfo = await app.model.Clinic.findOne({ condition: { transactionId: req.query.clinicId} });
    if(!clinicsInfo) return { customCode: 4016, message: "clinic does not exists"};
    let userInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/info`, {email: req.query.loginEmail, dappName: app.config.dappName});
    if(userInfo.role === "clinicmaster" || userInfo.role === "clinicadmin") {
      if(req.query.certificateType === "covid") {
        var checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: req.query.issuerEmail, userEmail: req.query.authorizer1Email});
        if(!checkMappingInfo) return { customCode: 4021, message: "users does satisfying clinic user role"};
      }
      if(req.query.certificateType === "vaccination") {
        var checkMappingInfo = await app.model.ClinicUser.exists({clinicId: req.query.clinicId, userEmail: req.query.issuerEmail, userEmail: req.query.authorizer1Email, userEmail: req.query.authorizer2Email});
        if(!checkMappingInfo) return { customCode: 4021, message: "users does satisfying clinic user role"};
      }

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
    } else {
      return { customCode: 4013, message: "incorrect user role to process clinic info" };
    }
});

app.route.post('/clinic',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.Clinic.count();
    let clinicsInfo = await app.model.Clinic.findAll({ offset: offset, limit: limit, condition: {} });

    return {data: clinicsInfo, total: count};
});

app.route.post('/clinic/users/:id',  async function (req) {
    let offset =  req.query.offset || 0;
    let limit = req.query.limit || 20;
    let count = await app.model.ClinicUser.count({ clinicId: req.params.id});
    let clinicsInfo = await app.model.ClinicUser.findAll({ offset: offset, limit: limit, condition: { clinicId: req.params.id} });

    return {data: clinicsInfo, total: count};
});
