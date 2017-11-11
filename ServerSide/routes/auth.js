
var express = require('express');
var router = express.Router();
var controller = require('../controllers/AuthController.js');



// entrance
router.get('/login', function (req, res, next) {
    controller.login(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json({Error:err});
        })
});



// registration, and login after successful registration
router.get('/register', function (req, res, next) {
    controller.register(req).then(function (document) {
            res.json(document);
        },
        function (err) {
        if (err.errmsg.search(/Email_1 dup key/) != -1) {
            res.json({Error:"This email is busy"});
        } else {
            res.json({Error: err});
        }
        })
});

// check the auth process 
router.get('/check', function (req, res, next) {
            res.json({Ok:"Backend is enabled"});
});


module.exports = router;