module.exports = {
  fixedPoint : Math.pow(10, 10),
  defaultCurrency: 'BEL', // default currency symbole for Belrium
  totalSupply: 2100000000000000000,
  URL: "http://localhost:9305",
  BKBS_URL: "http://47.254.241.229:8080",
  CENTRAL_PROFILE_URL: "http://localhost:9305",
  centralProfileDappId: "a06b64f4be75af4a73cbc0a1e7c30c5bb791efb6c3c6878f22cc34e25772bb39",
  admin: {
    secret: "frozen hour curious thunder relief accuse soccer region resource marine juice chicken",
    countryCode: "IN"
  },
  superUser: {
    email: "belfricsexchange@gmail.com",
    password: "Be@My*20T",
    secret: "kQuZcJaPzcBm"
  },
  cipher: {
    algorithm: "aes-256-cbc",
    key: "CentralServerSecret"
  },
  regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
  fees: {
    send: 0.001,
    inTransfer: 0.001,
    outTransfer: 0.001,
    registerClinic: 0,
    initiatePatientRecord: 0,
    approvedPatientRecord: 0,
    authorizedPatientRecord: 0,
    defaultFee: 0
  }
}
