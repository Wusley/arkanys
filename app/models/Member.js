module.exports = {
  name: { type: String, index: true, unique: true },
  master: { type: Boolean },
  staff: { type: Boolean, default: false },
  whatsapp: { type: String },
  bio: { type: String },
  avatar: { type: String },
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
  date: { type: Date, default: Date.now },
  rank: {
    unofficialMatch: { type: Number, default: 0 },
    tournament: { type: Number, default: 0 }
  }
};
