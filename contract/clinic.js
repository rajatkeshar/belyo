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
  }
}
