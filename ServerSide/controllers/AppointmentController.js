var mongoose = require('../db/mongoose.js')
var User = require('../db/models/User.js')
var UserType = require('../db/models/userType.js')
var Wrong = require('./Check.js');

function check(req){
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if (!req.query.CurrentUserId)
    {
        return Promise.resolve({Error:"Parameter (CurrentUserId) is required"});
    }
    if(Wrong.time(req,true)) {
        return Wrong.time(req,true);
    }
    if(!req.query.Log) {
        return Promise.resolve({Error:'Parameter (Log) is required'});
    }
    if(!req.query.Medication) {
        return Promise.resolve({Error:'Parameter (Medication) is required'});
    }
    return null;
}

exports.add = function (req) {
    if (err = check(req)) {
        return err;
    }
    return User.findOne({_id:req.query.CurrentUserId,Type:UserType.Type[1]}).then(function (currentUser) {
         if (currentUser) 
            findUser(req);
        
    });
}

exports.edit = function (req) {
    if (err = check(req)) {
        return err;
    }
    if (!req.query.Id)
    {
        return Promise.resolve({Error:"Parameter (Id) is required"});
    }
    return User.findOne({_id:req.query.CurrentUserId,Type:UserType.Type[1]}).then(function (currentUser) {
        if (currentUser) 
            findUser(req);
    })
}

exports.delete = function (req) {
    if (!req.query.CurrentUserId)
    {
        return Promise.resolve({Error:"Parameter (CurrentUserId) is required"});
    }
    if(!req.query.Id) {
        return Promise.resolve({Error:'Parameter (Id) is required'});
    }
    if(Wrong.email(req,true)) {
        return Wrong.email(req,true);
    }
    return User.findOne({_id:req.query.CurrentUserId,Type:UserType.Type[1]}).then(function (currentUser) {
     
        if (currentUser) 
            findUser(req);
    })
}


function findUser(req){
    
             return User.findOne({Email: req.query.Email, Type: UserType.Type[2],Doctor: currentUser._id}).then(function (findedUser) {
                if (findedUser) {
                    var Appointment = {
                        Date: new Date(req.query.Date), 
                        Medication: req.query.Medication,
                        Log: req.query.Log, 
                        Id: findedUser.appointmentIdCounter++,
                        DoctorID: currentUser._id
                    };
                    for (var i = 0; i < findedUser.Appointments.length; i++) {
                        if (findedUser.Appointments[i].Date == Appointment.Date.toString()) {
                            return Promise.resolve({Error: 'This time is busy by another appointment'});
                        }
                    }
                    findedUser.Appointments.push(Appointment);


                    return findedUser.save(function (err, updatedUser) {
                        if (err) {
                            return Promise.resolve({Error: err});
                        }
                        return updatedUser;
                    }).then(function (changedUser) {
                        if (changedUser) {
                            return Promise.resolve({Ok: 'Appointment was added'});
                        } else {
                            return Promise.resolve({Error: "Unknown error"});
                        }
                    });
                }
                else {
                    return Promise.resolve({Error: "Available patient with this email not find"});
                }
            })
        }
        else
        {
            return Promise.resolve({Error: "Doctor with this id not find"});
        }
    
}
