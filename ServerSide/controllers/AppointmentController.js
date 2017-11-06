var mongoose = require('../db/mongoose.js')
var User = require('../db/models/User.js')
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
    return User.findOne({_id:req.query.CurrentUserId,Type:'Doctor'}).then(function (currentUser) {
        if (currentUser) {
            return User.findOne({Email: req.query.Email, Type: 'Patient',Doctor: currentUser._id}).then(function (findedUser) {
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
    return User.findOne({_id:req.query.CurrentUserId,Type:'Doctor'}).then(function (currentUser) {
        if (currentUser) {
            return User.findOne({Email: req.query.Email, Type: 'Patient',Doctor:currentUser._id}).then(function (findedUser) {
                if (findedUser) {
                    var Appointment = {
                        Date: new Date(req.query.Date), Medication: req.query.Medication,
                        Log: req.query.Log, Id: req.query.Id
                    };
                    var AppointmentWasFind = false;
                    var TimeIsBusy = false;
                    for (var i = 0; i < findedUser.Appointments.length; i++) {
                        if (findedUser.Appointments[i].Id == req.query.Id) {
                            AppointmentWasFind = true;
                            findedUser.Appointments[i] = Appointment;
                        }
                        else if (findedUser.Appointments[i].Date == Appointment.Date.toString()) {
                            TimeIsBusy = true;
                        }
                    }
                    if (!AppointmentWasFind) {
                        return Promise.resolve({Error: "Appointment with this Id not found"});
                    }
                    if (TimeIsBusy) {
                        return Promise.resolve({Error: 'This time is busy by another appointment'});
                    }

                    return findedUser.save().then(function (changedUser) {
                        if (changedUser) {
                            return Promise.resolve({Ok: 'Appointment was changed'});
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
    return User.findOne({_id:req.query.CurrentUserId,Type:'Doctor'}).then(function (currentUser) {
        if (currentUser) {
            return User.findOne({Email: req.query.Email, Type: 'Patient',Doctor:currentUser._id}).then(function (findedUser) {
                if (findedUser) {
                    var AppointmentWasFind = false;
                    var deleteIndex = 0;
                    for (var i = 0; i < findedUser.Appointments.length; i++) {
                        if (findedUser.Appointments[i].Id == req.query.Id) {
                            AppointmentWasFind = true;
                            deleteIndex = i;
                        }
                    }
                    if (!AppointmentWasFind) {
                        return Promise.resolve({Error: "Appointment with this Id not found"});
                    }
                    findedUser.Appointments.splice(deleteIndex, 1);

                    return findedUser.save().then(function (changedUser) {
                        if (changedUser) {
                            return Promise.resolve({Ok: 'Appointment was deleted'});
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
    })
}
