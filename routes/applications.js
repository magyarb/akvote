/**
 * Created by balazs on 3/1/2017.
 */
var express = require('express');
var env = require("../env").env;
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var graph = require('fbgraph');
var db = require('../postgres');

var url = env.addr;


router.get('/', function (req, res) {
    console.log('GET applications')
    var appliarray = [];
    db.runq("SELECT * FROM users WHERE applicationpdf IS NOT NULL ORDER BY name", null, function (result) {
        result.rows.forEach(function (row) {
            var appli = {};
            //console.log(result.rows);
            appli.picurl = row['picurl'];
            appli.name = row['name'];
            appli.fbid = row['fbid'];
            appli.name = row['name'];
            appli.applicationpdf = row['applicationpdf'];
            console.log("Got: " + appli.name);
            appliarray.push(appli);
        });
        res.render('applications',
            {
                arr: appliarray,
                isak: req.user.isAK,
                ishok: req.user.isHOK
            });
    });
});

router.get('/uploader', function (req, res) {

    res.render('upload');

});

router.post('/upload', function (req, res) {
    try {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        var sampleFile = req.files.sampleFile;
        var currentdate = new Date();
        var filename = req.user.fbid + "-" + (currentdate.getMonth() + 1) + "-" +
            currentdate.getDate() + "-" +
            currentdate.getHours() + "-" +
            currentdate.getMinutes() + "-" +
            currentdate.getSeconds() + "-" + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('public/uploads/' + filename, function (err) {
            if (err) {
                req.flash('error_msg', 'Nem sikerült.');
                res.redirect('/applications');
            }

            db.runq("UPDATE users SET applicationpdf = $1 WHERE fbid = $2", [filename, req.user.fbid], function (result) {
                req.flash('success_msg', 'Feltöltve. Neve: ' + filename);
                res.redirect('/applications');
            });
        });
    }
    catch (e){
        req.flash('error_msg', 'Nem adtál meg fájlt.');
        res.redirect('/applications');
    }
});


module.exports = router;