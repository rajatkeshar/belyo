var constants = require('../utils/constants.js');
module.exports = {
  initiateCovidCert: async function(cId, cType, iEmail, pEmail, sId, sType, sDate, rDate, result) {
    console.log("calling contract initiate patient: ", this);
    app.sdb.lock('patient.initiateCovidCert@' + pEmail);
    app.sdb.create('Specimen', {
      clinicId: cId,
      certificateType: cType,
      issuerEmail: iEmail,
      patientEmail: pEmail,
      sampleId: sId,
      specimenType: sType,
      specimenDate: sDate,
      resultDate: rDate,
      result: result,
      cOn: new Date().getTime(),
      mOn: new Date().getTime(),
      transactionId: this.trs.id
    });
  },
  initiateVaccineCert: async function(cId, cType, iEmail, pEmail, vName, vOn, vTDate, vBy, vAt) {
    console.log("calling contract initiate patient: ", this);
    app.sdb.lock('patient.initiateVaccineCert@' + pEmail);
    app.sdb.create('Vaccine', {
      clinicId: cId,
      certificateType: cType,
      issuerEmail: iEmail,
      patientEmail: pEmail,
      vaccineName: vName,
      vaccineOn: vOn,
      validTillDate: vTDate,
      vaccinatedBy: vBy,
      vaccinatedAt: vAt,
      cOn: new Date().getTime(),
      mOn: new Date().getTime(),
      transactionId: this.trs.id
    });
  },
  authorizedPatientRecord: async function(certificateType, trsId, authorizerEmail, status) {
    if(certificateType === "covid") {
      console.log("calling contract authorized patient: ", this);
      app.sdb.lock('patient.authorizedPatientRecord@' + trsId);
      app.sdb.update('Specimen', { status: status }, {transactionId: trsId});
      app.sdb.update('Specimen', { mOn: new Date().getTime() }, {transactionId: trsId});
      app.sdb.update('Specimen', { authorizerEmail: authorizerEmail }, {transactionId: trsId});
    } else {
      let certsInfo = await app.model.Vaccine.findOne({ condition: {transactionId: trsId} });
      if(status === "rejected") {
        app.sdb.update('Vaccine', { status: status }, {transactionId: trsId});
        app.sdb.update('Vaccine', { mOn: new Date().getTime() }, {transactionId: trsId});
        app.sdb.update('Vaccine', { authorizer1Email: authorizerEmail }, {transactionId: trsId});
      } else if(!certsInfo.authorizer1Email) {
        app.sdb.update('Vaccine', { status: "authorized1" }, {transactionId: trsId});
        app.sdb.update('Vaccine', { mOn: new Date().getTime() }, {transactionId: trsId});
        app.sdb.update('Vaccine', { authorizer1Email: authorizerEmail }, {transactionId: trsId});
      } else {
        app.sdb.update('Vaccine', { status: "authorized2" }, {transactionId: trsId});
        app.sdb.update('Vaccine', { mOn: new Date().getTime() }, {transactionId: trsId});
        app.sdb.update('Vaccine', { authorizer2Email: authorizerEmail }, {transactionId: trsId});
      }
    }
  },
  approvedPatientRecord: async function(certificateType, trsId, status) {
    console.log("calling contract approved patient: ", this);
    if(certificateType === "covid") {
      app.sdb.lock('patient.approvedPatientRecord@' + trsId);
      app.sdb.update('Specimen', { status: status }, {transactionId: trsId});
      app.sdb.update('Specimen', { mOn: new Date().getTime() }, {transactionId: trsId});
    } else {
      app.sdb.lock('patient.approvedPatientRecord@' + trsId);
      app.sdb.update('Vaccine', { status: status }, {transactionId: trsId});
      app.sdb.update('Vaccine', { mOn: new Date().getTime() }, {transactionId: trsId});
    }
  }
}
