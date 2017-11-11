
var express = require('express');
var router = express.Router();
var controller = require('../controllers/AppointmentController.js');


 
router.get('/add', function (req, res, next) {
    controller.add(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});


// change meeting with doctor
router.get('/edit', function (req, res, next) {
    controller.edit(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});



// delete appointment with the doctor
router.get('/delete', function (req, res, next) {
    controller.delete(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});

module.exports = router;

