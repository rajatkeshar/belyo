var constants = require('../utils/constants.js');
module.exports = {
  registerClinic: async function(fName, lName, clinicName, email, phoneNo, dob, aadhar, addressLine1, addressLine2, city, pinCode, state, countryCode) {
    console.log("calling contract clinic: ", this);
    app.sdb.lock('clinic.registerClinic@' + email);
    app.sdb.create('Clinic', {
      fName: fName,
      lName: lName,
      clinicName: clinicName,
      email: email,
      phoneNo: phoneNo,
      dob: dob,
      aadhar: aadhar,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      pinCode: pinCode,
      state: state,
      countryCode: countryCode,
      timestamp: this.trs.timestamp,
      transactionId: this.trs.id
    });
  },
  mapClinicUser: async function(clinicId, loginEmail, userEmail, role) {
    console.log("calling contract clinic: ", this);
    app.sdb.lock('clinic.mapClinicUser@' + userEmail );
    app.sdb.create('Clinicuser', {
      clinicId: clinicId,
      loginEmail: loginEmail,
      userEmail: userEmail,
      role: role,
      cOn: new Date().getTime(),
      mOn: new Date().getTime(),
      transactionId: this.trs.id
    });
  },
  updateClinicUserStatus: async function(clinicId, uEmail, status) {
    console.log("calling contract clinic: ", this);
    app.sdb.lock('clinic.updateClinicUserStatus@' + clinicId );
    app.sdb.update('Clinicuser', {status: status}, {clinicId: clinicId, userEmail: uEmail});
  },
  updateClinicMaster: async function(clinicId, email) {
    console.log("calling contract clinic: ", this);
    app.sdb.lock('clinic.updateClinicMaster@' + email );
    app.sdb.update('Clinic', {email: email}, {transactionId: clinicId});
  },
  updateClinicStatus: async function(clinicId, status) {
    console.log("calling contract clinic: ", this);
    app.sdb.lock('clinic.updateClinicStatus@' + clinicId );
    app.sdb.update('Clinic', {status: status}, {transactionId: clinicId});
    if(status === "inactive") {
      //let clinicUsers = await app.model.ClinicUser.findAll({ condition: { clinicId: clinicId} });
      //clinicUsers.forEach((users, i) => {
        app.sdb.update('Clinicuser', {status: status}, {clinicId: clinicId});
      //});
    }
  },
  mapUsersLevel: async function(cId, iEmail, a1Email, a2Email, cType) {
    console.log("calling contract clinic: ", this);
    var exists = await app.model.Level.exists({ clinicId: cId, certificateType: cType});
    if(exists) {
      app.sdb.update('Level', {issuerEmail: iEmail}, {clinicId: cId, certificateType: cType});
      app.sdb.update('Level', {authorizer1Email: a1Email}, {clinicId: cId, certificateType: cType});
      app.sdb.update('Level', {authorizer1Email: a2Email}, {clinicId: cId, certificateType: cType});
      app.sdb.update('Level', {mOn: new Date().getTime()}, {clinicId: cId, certificateType: cType});
    } else {
      app.sdb.create('Level', {
        clinicId: cId,
        issuerEmail: iEmail,
        authorizer1Email: a1Email,
        authorizer2Email: a2Email,
        certificateType: cType,
        level: (cType == "covid")? 1: 2,
        cOn: new Date().getTime(),
        mOn: new Date().getTime(),
        transactionId: this.trs.id
      });
    }
  }
}
