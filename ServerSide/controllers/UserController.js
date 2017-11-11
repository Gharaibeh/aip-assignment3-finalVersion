var mongoose = require('../db/mongoose.js')
var User = require('../db/models/User.js')
var UserType = require('../db/models/userType.js')
var Wrong = require('./Check.js');

// user combine object (add a user to DB)
exports.add = function (req) {
    if (!req.query.Id) {
        return Promise.resolve({Error:"Parameter (Id) is required"})
    }
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.password(req,true)) {
        return promise;
    }
    if(!req.query.FullName) {
        return Promise.resolve({Error: "Parameter (FisrtName) is required"})
    }
    return User.findOne({_id: req.query.Id}).then(function (currentUser) {
        if (currentUser) {
            var user = new User({
                FullName: req.query.FullName,
                Email: req.query.Email,
                salt: Math.random() + '',
            });
                if (currentUser.Type === UserType.Type[1]) {
                    user.Type = 'Doctor';
                } else if (currentUser.Type === userType.Type[2]) {
                    user.Type = 'Patient'
                    user.Doctor = currentUser._id;
                } else {
                    return Promise.resolve({Error: "You dont have right for this action"})
                }

            if (req.query.Gender) {
                if (promise = Wrong.gender(req, true)) {
                    return promise;
                }
                user.Gender = req.query.Gender;
            }
            if (req.query.City) {
                user.City = req.query.City;
            }
            if (req.query.DateOfBirth) {
                if (promise = Wrong.date(req, true)) {
                    return promise;
                }
                user.DateOfBirth = req.query.DateOfBirth;
            }

            user.Password = user.encryptPassword(req.query.Password);
            return user.save().then(function (addedUser) {
                if (addedUser) {
                    return Promise.resolve({Ok: 'User was added'});
                } else {
                    return Promise.resolve({Error: 'Unknown error'});
                }
            });
        }
        else {
            return Promise.resolve({Error: "User with this email not find"});
        }
    });
}

// user  object (edit a user to DB)
exports.edit = function (req) {
    // checking the ID first
    if (!req.query.Id) {
        return Promise.resolve({Error:"Parameter (Id) is required"})
    }
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.type(req,true)) {
        return promise;
    }
    // if true continue to determine the object type {Admin, Doctor or Patient}
            return User.findOne({_id: req.query.Id}).then(function (currentUser) {
               if (currentUser) {
                   var search = {Email: req.query.Email, Type: req.query.Type};
                   if (currentUser.Type == UserType.Type[0] || currentUser.Type == UserType.Type[1]) {
                       if (currentUser.Type == UserType.Type[1]) {
                           search.Doctor = currentUser._id;
                       }
                       return User.findOne(search).then(function (findedUser) {

                           if (findedUser) {
                               if (req.query.FullName) findedUser.FullName = req.query.FullName;
                               if (req.query.Password) findedUser.Password = findedUser.encryptPassword(req.query.Password);
                               if (req.query.Gender) {
                                   if (promise = Wrong.gender(req, true)) {
                                       return promise;
                                   }
                                   findedUser.Gender = req.query.Gender;
                               }
                               if (req.query.City) findedUser.City = req.query.City;
                               if (req.query.DateOfBirth) {
                                   if (promise = Wrong.date(req, true)) {
                                       return promise;
                                   }
                                   findedUser.DateOfBirth = req.query.DateOfBirth;
                               }

                               return findedUser.save().then(function (changedUser) {
                                   if (changedUser) {
                                       return Promise.resolve({Ok: 'User was changed'});
                                   } else {
                                       return Promise.resolve({Error: "Unknown error"});
                                   }
                               });
                           }
                           else {
                               return Promise.resolve({Error: "Available for edit user with this email not found"});
                           }
                       });
                   } else {
                       return Promise.resolve({Error: "You dont have right for this action"});
                   }
               }

                else {
                   return Promise.resolve({Error: "User with this email not find"});
               }

            });

}

// reset password part
exports.resetPassword = function (req) {
    if (!req.query.Id) {
        return Promise.resolve({Error:"Parameter (Id) is required"})
    }
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.password(req,true)) {
        return promise;
    }
    return User.findOne({_id: req.query.Id}).then(function (currentUser) {
        if (currentUser) {
            if (currentUser.Type != 'Admin') {
                return Promise.resolve({Error: "You dont have right for this action"})
            }
        return User.findOne({Email: req.query.Email}).then(function (findedUser) {
            if (findedUser) {
                if (req.query.Password) findedUser.Password = findedUser.encryptPassword(req.query.Password);

                return findedUser.save(function (err, updatedUser) {
                    if (err) {
                        return Promise.resolve({Error: err});
                    }
                    return updatedUser;
                }).then(function (updateUser) {
                    if (updateUser) {
                        return Promise.resolve({Ok: "Password has been changed"});
                    } else {
                        return Promise.resolve({Error: "Unknown error"});
                    }
                });
            }
            else {
                return Promise.resolve({Error: "User with this email not find"});
            }
        });
    } else {
            return Promise.resolve({Error:"User with this id not found"});
    }

});
}

// return the user deletion result
exports.delete = function (req) {
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.type(req,true)) {
        return promise;
    }

    if (req.query.Id) {

            return User.findOne({_id: req.query.Id}).then(function (currentUser) {
                if (currentUser) {
                    if ((currentUser.Type === UserType.Type[0] && req.query.Type != UserType.Type[1])
                        || (currentUser.Type === UserType.Type[1] && req.query.Type != UserType.Type[2])) {
                        return Promise.resolve({Error: "You dont have rights for this action"});
                    } else {
                        var search = {Email: req.query.Email, Type: req.query.Type};
                        if (currentUser.Type === UserType.Type[1]) {
                            search.Doctor = currentUser._id;
                        }
                        return User.findOne(search).then(function (findedUser) {
                            if (findedUser) {
                                return User.remove({Email: req.query.Email, Type: req.query.Type}, function (ok, err) {
                                    if (err) return Promise.resolve(err);
                                }).then(function (ok) {
                                    return Promise.resolve({Ok: "User was removed"});
                                })
                            } else {
                                return Promise.resolve({Error: "Your patient with this email not find"});
                            }
                        })
                    }
                }else {
                    return Promise.resolve({Error: "You are not logged in"})
                }
            })
    } else {
        return Promise.resolve({Error: "Parameter (Id) is required"})
    }
}

exports.search = function (req) {
    if (!req.query.Id) {
        return Promise.resolve({Error:"Parameter (Id) is required"})
    }

    return User.findOne({_id:req.query.Id}).then(function (currentUser){
        if (currentUser) {
            var searchFields = {};
            if (req.query.FullName) {
               searchFields.FullName = new RegExp(req.query.FullName,'i');
            }
            if (req.query.Email) {
                searchFields.Email = new RegExp(req.query.Email,'i');
            }
            if (req.query.Gender) {
                searchFields.Gender = new RegExp(req.query.Gender,'i');
            }
            if (req.query.City) {
                searchFields.City = new RegExp(req.query.City,'i');
            }
            if (req.query.DateOfBirth) {
                searchFields.DateOfBirth = new RegExp(req.query.DateOfBirth,'i');
            }
            if (currentUser.Type == UserType.Type[1]) {
                searchFields.Type = UserType.Type[2];
                searchFields.Doctor = currentUser._id;
            } else if(currentUser.Type == UserType.Type[0] || currentUser.Type == UserType.Type[2]) {
                searchFields.Type = UserType.Type[1];
            } else {
                return Promise.resolve({Error:"You are not login"});
            }

            return User.find(searchFields).populate("Doctor").exec(function (err, doctor) {
                if (err) {
                    return Promise.resolve({Error: err});
                }
                return doctor;

            });

        } else {
            return Promise.resolve({Error:"User with this id not found"});
        }
    });

}

exports.allPatients = function (req) {
    if (!req.query.Id) {
        return Promise.resolve({Error:"Parameter (Id) is required"})
    }
    return User.findOne({_id:req.query.Id}).then(function (findedUser) {
        if (findedUser) {
            if (findedUser.Type != 'Admin') {
                return Promise.resolve({Error:"You dont have right for this action"})
            } else {
                var searchFields = {Type:'Patient'};

                return User.find(searchFields).populate("Doctor").exec(function (err, doctor) {
                    if (err) {
                        return Promise.resolve({Error: err});
                    }
                    return doctor;
                });
            }

        } else {
            return Promise.resolve({Error:"User with this id not found"})
        }

    })

}

// temporary function for debugging, displays all users from the database

exports.find = function (req) {
    return User.find({});
}

exports.findById = function (req) {
    if (!req.query.Id) {
        return Promise.resolve({Error:"Parameter (Id) is required"})
    }
    return User.findOne({_id:req.query.Id}).populate("Doctor").populate("Appointments.DoctorID").exec(function (err, doctor) {
        if (err) {
            return Promise.resolve({Error: err});
        }
        return doctor;
    }).then(function(findedUser){
        if (findedUser) {
            return findedUser;
        } else {
            return Promise.resolve({Error:"User not found"})
        }
    });
}

// binding pateints with doctors part
exports.bindDoctor = function (req) {
    if (!req.query.PatientId) {
        return Promise.resolve({Error:"Parameter (PatientId) is required"})
    }
    if (!req.query.DoctorId) {
        return Promise.resolve({Error:"Parameter (DoctorId) is required"})
    }
    var search = {_id: req.query.DoctorId};
    return User.findOne(search).then(function (doc) {
        if (doc) {
            if (doc.Type != 'Doctor') {
                return Promise.resolve({Error: "Doctor with this id not find"});
            } else {
                return User.findOne({_id:req.query.PatientId}).then(function (patient) {
                    if (patient) {
                        if (patient.Type != 'Patient') {
                            return Promise.resolve({Error: "Patient with this id not find"});
                        }
                        patient.Doctor = doc._id;
                        return patient.save().then(function (saved) {
                            if (saved) {
                                return Promise.resolve({Ok: "Doctor was bind to you account"});
                            }
                            return Promise.resolve({Error: "Unknown error"});
                        });
                    } else {
                        return Promise.resolve({Error: "Patient with this id not find"});
                    }

                });
            }

        }
        else {
            return Promise.resolve({Error: "Doctor with this id not find"});
        }
    });
}

