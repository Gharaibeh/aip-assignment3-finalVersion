 var mongoose = require('mongoose');

//Mongo Schema ajd user type structure
var UserTypeSchema = new mongoose.Schema({
    
    Type: {
        type: String,
         enum: ['Admin', 'Doctor', 'Patient']
    },
    

},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})


 
 