const mongoose = require('mongoose');
//Use global promise for mongoose
mongoose.Promise = global.Promise;

//Make Schema
const requestSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'A Message Request Should have a valid User!'
    },
    phone: {
        type: String,
        required: 'Please supply a valid Phone Number'
    },
    contactMethod: {
        type: String,
        required: 'Please select a valid method to contact you'
    },
    legalService: {
        type: String,
        required: 'Please select the legal area you require assistance'
    },
    location: {
        type: String,
        required: 'Please select a Valid Location'
    },
    message: {
        type: String,
        trim: true,
        required: 'Enter a blog content'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Request', requestSchema);