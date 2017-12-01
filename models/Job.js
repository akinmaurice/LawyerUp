const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Use global promise for mongoose
mongoose.Promise = global.Promise;

// Make Schema
const jobSchema = new Schema({
  title: {
    type: String,
    required: 'Please supply a valid Job Title',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', jobSchema);
