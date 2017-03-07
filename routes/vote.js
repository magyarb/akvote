/**
 * Created by balazs on 3/1/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var graph = require('fbgraph');
var env = require("../env").env;
var db = require("../postgres");

var url = "http://localhost:3000";

router.get('/:name', ifVoting, function(req, res){
    try {
        db.runq("UPDATE users SET votedfor = $1 WHERE fbid = $2", [req.params.name, req.user.fbid], function (result) {
            console.log(req.user.fbid + ' VOTED FOR ' + req.params.name);
        });

        db.runq("SELECT name FROM users WHERE fbid = $1", [req.params.name], function (result) {
            var name = result.rows[0]['name'];
            console.log('SELECTED' + req.params.name);
            req.flash('success_msg', 'Sikeresen szavaztál ' + name + '-ra.');
            res.redirect('/applications');
        });
    }
    catch (e)
    {
        req.flash('error_msg', 'Be kéne jelentkezni.');
        res.redirect('/users/login');
    }
});

function ifVoting(req, res, next) {
    var now = new Date();
    if (env.votingStarts < now && env.votingEnds > now) {
        return next();
    } else {
        req.flash('error_msg', 'Jelenleg nincs szavazási időszak.');
        res.redirect('/applications');
    }
}

module.exports = router;