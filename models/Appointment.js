const mongoose = require('mongoose');
// Use global promise for mongoose
mongoose.Promise = global.Promise;

// Make Schema
const appointmentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'A Message Request Should have a valid User!',
  },
  name: {
    type: String,
    required: 'A valid Name is Required',
  },
  email: {
    type: String,
    required: 'A valid Email is Required',
  },
  phone: {
    type: String,
    required: 'Please supply a valid Phone Number',
  },
  legalService: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  lawyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lawyer',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
