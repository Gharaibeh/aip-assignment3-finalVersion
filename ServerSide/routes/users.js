var express = require('express');
var router = express.Router();
var controller = require('../controllers/UserController.js');



router.get('/add', function (req, res, next) {

    controller.add(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.errmsg.search(/Email_1 dup key/) != -1) {
                res.json({Error:"This email is busy"});
            }
            else if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json({Error: err});
            }
        })
});

// edit the user

router.get('/edit', function (req, res, next) {
    controller.edit(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.errmsg.search(/Email_1 dup key/) != -1) {
                res.json({Error:"This email is busy"});
            }
            else if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json({Error: err});
            }
        })

});

// change Password

router.get('/resetPassword', function (req, res, next) {
    controller.resetPassword(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })

});

// performs a search depending on who is logged in, if Doctor - returns patients (with a list of their treating doctors),


router.get('/search', function (req, res, next) {
    controller.search(req).then(function (document) {
            res.json(document);
        },
        function (err) {
        if (err.message.search(/Cast to ObjectId failed/) != -1)
        {
            res.json({Error:"User with this id not found"})
        }
        else {
            res.json(err);
        }
        })
});


// delete the user

router.get('/delete', function (req, res, next) {
    controller.delete(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })
});



// returns a list of all patients with their doctors
router.get('/patients', function (req, res, next) {
    controller.allPatients(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })
});

// Testing function for debugging, displays all users from the database
router.get('/', function (req, res, next) { 
    controller.find(req).then(function (document) {

            res.send(document);
        },
        function (err) {
            res.json(err);
        })
});

// mandatory parameters Id
// return the user's data in this format

/*
{
    _id: "59d3679542a7d70340036fe2",
    Password: "f256d755ea4bf9c502e5e1d1191599f812c1980e",
    FullName: "DrMe",
    Email: "123@2.com",
    Type: "Doctor",
    salt: "0.8515276845630868",
    __v: 0,
    appointmentIdCounter: 0,
    Appointments: [ ]
}
*/
router.get('/findById', function (req, res, next) {
    controller.findById(req).then(function (document) {
            res.send(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })
});
 

router.get('/bindDoctor', function (req, res, next) {
    controller.bindDoctor(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});

module.exports = router;
