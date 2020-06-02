module.exports = {
  name: { type: String, index: true, unique: true },
  master: { type: Boolean },
  date: { type: Date, default: Date.now }
};
