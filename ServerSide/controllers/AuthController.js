var mongoose = require('../db/mongoose.js')
var User = require('../db/models/User.js')
var Wrong = require('./Check.js');

exports.login = function (req) {
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.password(req,true)) {
        return promise;
    }
    if (req.query.Id)
    {
        return Promise.resolve({Error:"You already login"});
    }
    var search = {Email: req.query.Email};
    return User.findOne(search).then(function (findedUser) {
        if (findedUser) {
            if (findedUser.checkPass(req.query.Password)) {
                return Promise.resolve({Ok:"You are logged in",Id:findedUser._id,User:findedUser});
            }
            else {
                return new Promise(function (resolve, reject) {
                    resolve({Error: "Wrong password"});
                });
            }
        }
        else {
            return Promise.resolve({Error: "User with this email not found"});
        }
    });

}


exports.register = function (req) {
    if (req.query.Id)
    {
        return Promise.resolve({Error:"You already login"});
    }
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.password(req,true)) {
        return promise;
    }
    if ( promise = Wrong.type(req,true)) {
        return promise;
    }
    if(!req.query.FullName) {
        return Promise.resolve({Error: "Parameter (FullName) is required"})
    }
    var user = new User({
        FullName: req.query.FullName,
        Email: req.query.Email,
        Type: req.query.Type,
        salt: Math.random() + ''
    });


    if (req.query.Gender) {
        if ( promise = Wrong.gender(req,true)) {
            return promise;
        }
        user.Gender = req.query.Gender;
    }
    if (req.query.City) {
        user.City = req.query.City;
    }
    if (req.query.DateOfBirth) {
        if ( promise = Wrong.date(req,true)) {
            return promise;
        }
        user.DateOfBirth = req.query.DateOfBirth;
    }

    user.Password = user.encryptPassword(req.query.Password);
    return user.save(function (err, user, affected) {

        if (err) {
            return Promise.resolve({Error: err});
        }
        return user;
    }).then(function (registerUser) {
        if (registerUser) {
                return Promise.resolve({Ok:"Your registration complete and you logged in",Id:registerUser._id,User:registerUser});
        }
        else {
            return Promise.resolve({Error: "Registration error"});
        }
        
    });

}

