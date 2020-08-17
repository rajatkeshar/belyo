var constants = require('../utils/constants.js');
module.exports = {
  registerClinic: async function(fName, lName, clinicName, email, phoneNo, dob, aadhar, addressLine1, addressLine2, city, pinCode, state, countryCode) {
    console.log("calling contract belShare: ", this);
    app.sdb.lock('belShare.belShare@' + userId);
    app.sdb.create('Clinic', {
      fname: fName,
      lname: lName,
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
      timestamp: this.trs.timestamp
    });
  }
}
