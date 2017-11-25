const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Use global promise for mongoose
mongoose.Promise = global.Promise;
const slug = require('slugs');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const lawyerSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please Supply and email address'
    },
    slug: String,
    name: {
        type: String,
        required: 'Please Supply a name!',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    rate: {
        type: Number,
        required: 'Rate Field cannot be empty'
    },
    about: {
        type: String,
        required: 'About field cannot be empty!'
    },
    gender: {
        type: String,
        required: 'Please Provide a valid Gender'
    },
    barYear: {
        type: Date,
    },
    linkedin: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    tags: [String],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

lawyerSchema.virtual('gravatar').get(function () {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

/*Auto generate slugs and pre-save before someone saves a post in the schema.
not needed for new post only stores with changed title*/
lawyerSchema.pre('save', async function (next) {
    if (!this.isModified('name')) {
        next(); // Skip
        return; // stop this this function back to save
    }
    /* THis takes the Name of the Lawyer, run it through the schema
    and get the slug field and assign it to the output */
    this.slug = slug(this.name);
    //find Lawyer with the same slug.
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const lawyerWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (lawyerWithSlug.length) {
        this.slug = `${this.slug}-${lawyerWithSlug.length + 1}`;
    }
    //Move to the next function. i.e continue to save the store
    next();
});

//Model to get the tag list
lawyerSchema.statics.getTagsList = function () {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
}

lawyerSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
lawyerSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Lawyer', lawyerSchema);