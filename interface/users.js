var _ = require('lodash');
var util = require("../utils/util");
var auth = require("../utils/auth");
var belriumJS = require('belrium-js');
var aesUtil = require("../utils/aesUtil");
var Address = require('../utils/address.js');
var apiCall = require('../utils/apiCall.js');
var httpCall = require('../utils/httpCall.js');
var constants = require('../utils/constants.js');
var addressHelper = require('../utils/address.js');
var z_schema = require('../utils/zschema-express.js');
var TransactionTypes = require('../utils/transaction-types.js');
const enum = ["superadmin", "subadmin", "clinicmaster", "clinicadmin", "issuer", "authorizer"];

app.route.put('/user',  async function (req) {
    req.query.dappName = app.config.dappName;
    let data = auth.parseRequestToken(req.body.token);
    let loginInfo = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/user/${req.params.token}`, data);
    let validateRole = false;

    if(loginInfo.role == "superadmin") {
      validateRole = true;
    }
    if(loginInfo.role == "subadmin") {
      validateRole = (req.body.role == "clinicmaster")? true: false;
    }
    if(loginInfo.role == "clinicmaster") {
      validateRole = (req.body.role == "clinicadmin" || req.body.role == "issuer" || req.body.role == "authorizer")? true: false;
    }
    if(loginInfo.role == "clinicadmin") {
      validateRole = (req.body.role == "issuer" || req.body.role == "authorizer")? true: false;
    }
    
    if(!validateRole) {
      return { customCode: 4012, message: "not authorized to add this role" };
    }

    let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/user`, req.query);
    return response;
})

app.route.put('/user/:token',  async function (req) {
    let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/user/${req.params.token}`, req.query);
    return response;
});

app.route.post('/users/login',  async function (req) {
  req.query.dappName = app.config.dappName;
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/login`, req.query);
  response.token = auth.generateToken(req.query);
  return response;
});

app.route.post('/users/role/:roleType',  async function (req) {
  req.query.dappName = app.config.dappName;
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/role/${req.params.roleType}`, req.query);
  return response;
});

app.route.post('/users/auth/forgetPassword',  async function (req) {
  req.query.dappName = app.config.dappName;
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "POST", `/api/dapps/${constants.centralProfileDappId}/users/auth/forgetPassword`, req.query);
  return response;
});

app.route.put('/users/auth/confirmPassword/:token',  async function (req) {
  let response = await apiCall.call(constants.CENTRAL_PROFILE_URL, "PUT", `/api/dapps/${constants.centralProfileDappId}/users/auth/confirmPassword/${req.params.token}`, req.query);
  return response;
});
