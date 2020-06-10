module.exports = {
  name: { type: String, index: true, unique: true },
  master: { type: Boolean },
  whatsapp: { type: String },
  yourMasterId: { type: String },
  yourDisciples: [ {
    id: { type: String }
  } ],
  date: { type: Date, default: Date.now }
};
