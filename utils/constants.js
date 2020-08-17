module.exports = {
  fixedPoint : Math.pow(10, 10),
  defaultCurrency: 'BEL', // default currency symbole for Belrium
  totalSupply: 2100000000000000000,
  URL: "http://localhost:9305",
  BKBS_URL: "http://47.254.241.229:8080",
  CENTRAL_PROFILE_URL: "http://localhost:9305",
  centralProfileDappId: "f9db4fbc74020544f10b840b85909375c6808a7baddff8b1d4ce65cbcac7205e",
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
    defaultFee: 0
  }
}
