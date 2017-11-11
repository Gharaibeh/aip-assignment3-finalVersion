var mongoose = require('../db/mongoose.js')
var User = require('../db/models/User.js')
var Wrong = require('./Check.js');

// user authentication page
//check the login status
exports.login = function (req) {
    if ( promise = Wrong.email(req,true)) {
        return promise;
    }
    if ( promise = Wrong.password(req,true)) {
        return promise;
    }
    // if there is an ID, and return wrong password in case wrong
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
        else { // else the user hasn't been found
            return Promise.resolve({Error: "User with this email not found"});
        }
    });

}

// register a user 
exports.register = function (req) {
    //check if there is ID
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
    // user object contains FullName, Email, Type and Salt as random
    var user = new User({
        FullName: req.query.FullName,
        Email: req.query.Email,
        Type: req.query.Type,
        salt: Math.random() + ''
    });


    // user gender 
    if (req.query.Gender) {
        if ( promise = Wrong.gender(req,true)) {
            return promise;
        }
        user.Gender = req.query.Gender;
    }
    //user city 
    if (req.query.City) {
        user.City = req.query.City;
    }
    // user DOB
    if (req.query.DateOfBirth) {
        if ( promise = Wrong.date(req,true)) {
            return promise;
        }
        user.DateOfBirth = req.query.DateOfBirth;
    }

    // user password
    user.Password = user.encryptPassword(req.query.Password);
    return user.save(function (err, user, affected) {

        if (err) {
            return Promise.resolve({Error: err});
        }
        return user;
    }).then(function (registerUser) {
        if (registerUser) {
                return Promise.resolve({Ok:"Your registration complete and you logged in",  Id:registerUser._id,User:registerUser});
        }
        else {
            return Promise.resolve({Error: "Registration error"});
        }
        
    });

}

