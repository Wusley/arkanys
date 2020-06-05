module.exports = {
  name: { type: String, index: true, unique: true },
  master: { type: Boolean },
  yourMasterId: { type: String },
  date: { type: Date, default: Date.now }
};
