var constants = require('../utils/constants.js');
module.exports = {
  initiatePatientRecord: async function(fName, lName, issuerEmail, email, phoneNo, dob) {
    console.log("calling contract initiate patient: ", this);
    app.sdb.lock('patient.initiatePatientRecord@' + email);
    app.sdb.create('Patient', {
      fName: fName,
      lName: lName,
      issuerEmail: issuerEmail,
      email: email,
      phoneNo: phoneNo,
      dob: dob,
      cOn: new Date().getTime(),
      mOn: new Date().getTime(),
      transactionId: this.trs.id,
      timestamp: this.trs.timestamp
    });
  },
  authorizedPatientRecord: async function(trsId, authorizerEmail, report, result) {
    console.log("calling contract authorized patient: ", this);
    app.sdb.lock('patient.authorizedPatientRecord@' + trsId);
    app.sdb.update('Patient', { report: report }, {transactionId: trsId});
    app.sdb.update('Patient', { result: result }, {transactionId: trsId});
    app.sdb.update('Patient', { mOn: new Date().getTime() }, {transactionId: trsId});
    app.sdb.update('Patient', { authorizerEmail: authorizerEmail }, {transactionId: trsId});
  },
  approvedPatientRecord: async function(trsId, report) {
    console.log("calling contract approved patient: ", this);
    app.sdb.lock('patient.approvedPatientRecord@' + trsId);
    app.sdb.update('Patient', { report: report }, {transactionId: trsId});
    app.sdb.update('Patient', { mOn: new Date().getTime() }, {transactionId: trsId});
  }
}
