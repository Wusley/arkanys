module.exports = {
  name: { type: String, index: true, unique: true },
  master: { type: Boolean },
  staff: { type: Boolean },
  whatsapp: { type: String },
  bio: { type: String },
  yourMasterId: { type: String },
  yourDisciples: [ {
    id: { type: String }
  } ],
  fbLogin: {
    accessToken: String,
    data_access_expiration_time: Number,
    expiresIn: Number,
    signedRequest: String,
    userID: String
  },
  googleLogin: {
    token: String,
    userID: String
  },
  date: { type: Date, default: Date.now }
};
