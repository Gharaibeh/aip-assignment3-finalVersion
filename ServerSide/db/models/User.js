var crypto = require('crypto');
var mongoose = require('mongoose');

//Mongo Schema ajd user type structure
var UserSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: [true, 'FullName is required']
    },
    Password: {
        type: String,
        required: [true, 'Password is required']
    },
    salt: {
        type: String,
        required: [true, 'Salt is required']
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    Type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['Admin', 'Doctor', 'Patient']
    },
    Gender: {
        type: String,
        enum: ["Male","Female"]
    },
    City: {
        type: String,
    },
    DateOfBirth: {
        type: String,
    },
    Doctor: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
     },
    Appointments: {
          type: [{
              Id: Number,
              Date: Date,
              Medication:  String,
              Log: String,
              DoctorID: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'User'
              },
          }]
    },
    appointmentIdCounter : {
        type: Number,
        default: 0
    },

},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})


// Password Encryption as hex 
UserSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

// user check schema
UserSchema.methods.checkPass = function (pass) {
    return this.encryptPassword(pass) === this.Password;
}

// user model export ..

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel
