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


router.get('/', ensureAuthenticated, function (req, res) {
    console.log('GET applications')
    var appliarray = [];
    db.runq("SELECT * FROM show_myvotes($1)", [req.user.fbid], function (result) {
        var arr = result.rows;
        arr.forEach(function (row) {
            var appli = {};
            //console.log(result.rows);

            appli.picurl = row['picurl'];
            appli.name = row['name'];
            appli.fbid = row['fbid'];
            appli.name = row['name'];
            appli.applicationpdf = row['applicationpdf'];
            if(row['user'] == null) {
                appli.myvote = false;
            }
            else
                appli.myvote = true;
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

router.get('/uploader', ensureAuthenticated, ifBeforeVoting, function (req, res) {

    res.render('upload');

});

router.post('/upload', ensureAuthenticated, function (req, res) {
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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Be kéne jelentkezni.');
        res.redirect('/users/login');
    }
}
function ifBeforeVoting(req, res, next) {
    var now = new Date();
    if (env.votingStarts > now) {
        return next();
    } else {
        req.flash('error_msg', 'Már nem tudsz leadni pályázatot.');
        res.redirect('/applications');
    }
}

module.exports = router;