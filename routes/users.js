var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var graph = require('fbgraph');
var db = require("../postgres");
var env = require("../env").env;

var url = env.addr;

var User = require('../models/user');

// Register
router.get('/details', ensureAuthenticated, function (req, res) {
    db.runq("SELECT name FROM users WHERE fbid = (SELECT votedfor FROM users WHERE fbid = $1)", [req.user.fbid], function (result) {
        var votedfor = null;
        try{
            votedfor = result.rows[0]['name'];
        }
        catch (e)
        {}
        res.render('details',
            {
                username: req.user.name,
                isak: req.user.isAK,
                ishok: req.user.isHOK,
                votedfor: votedfor,
                start: env.votingStarts,
                end: env.votingEnds
            });
    });



});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Be kéne jelentkezni.');
        res.redirect('/users/login');
    }
}
// Login
router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/getvoters', function (req, res) {

    graph.setAccessToken(req.user.fbtoken);
    console.log(req.user.fbtoken);
    graph.setVersion("2.6");
    graph.get("459722457389411/members", doSomething);

    function doSomething(error, response) {
        response.data.forEach(function (element, index, array) {
            //console.log(element.id);
            //console.log(element.name);
            /*pool.query('INSERT INTO users(fbid, isak, name) VALUES($1, $2, $3)', [element.id, true, element.name], function (err, result) {
             if(err){
             console.log(err);
             return console.error('v');
             done(err);
             }
             //console.log(result.rows);
             console.log("SAVED: " + element.name);
             });*/
            db.runq("UPDATE users SET isak = $2 WHERE fbid = $1",  [element.id, true], function (result) {
                if (result.rowCount > 0) {
                    console.log("SAVED: " + element.name);
                }
            });
        });
        if (typeof response.paging.next !== "undefined") {
            console.log(response.paging.next);
            graph.get(response.paging.next, doSomething);
        }
        else {
            req.flash('success_msg', 'Az AK taglistája a FB csoport alapján frissítve.');
            res.redirect('/users/details');
        }
    }
});

router.get('/init', function (req, res) {
    if(req.user != undefined && req.user.fbid == 1825485949) {
        graph.setAccessToken(req.user.fbtoken);
        console.log(req.user.fbtoken);
        graph.setVersion("2.6");
        graph.get("459722457389411/members", doSomething);

        function doSomething(error, response) {
            response.data.forEach(function (element, index, array) {
                //console.log(element.id);
                //console.log(element.name);
                db.runq("INSERT INTO users(fbid, isak, name) VALUES($1, $2, $3)", [element.id, true, element.name], function (result) {
                    console.log("SAVED: " + element.name);
                });
            });
            if (typeof response.paging.next !== "undefined") {
                console.log(response.paging.next);
                graph.get(response.paging.next, doSomething);
            }
            else {
                req.flash('success_msg', 'Az AK taglistája a FB csoport alapján frissítve.');
                res.redirect('/users/details');
            }
        }
    }
    else
    {
        req.flash('error_msg', 'Ilyet nem csinálhatsz.');
        res.redirect('/users/details');
    }
});

router.get('/lofasz', function (req, res) {
    res.send('aaz');
});

passport.use(new FacebookStrategy({
        clientID: env.fbclient,
        clientSecret: env.fbsecret,
        callbackURL: url + "/users/auth/facebook/callback",
        profileFields: ['name', 'emails', 'gender', 'profileUrl', 'picture']
    },
    function (accessToken, refreshToken, profile, done) {

        process.nextTick(function () {
            //console.log(profile);
            User.findOne(profile.id, function (err, asd, user) {
                if (err)
                    return done(err);

                if (user.fbid > 0) {
                    console.log("findone found user:" + user.fbid);
                    db.runq("UPDATE users SET fbtoken = $1, name = $2, email = $3, picurl = $4 WHERE fbid = $5", [accessToken, profile.name.familyName + ' ' + profile.name.givenName, profile.emails[0].value, profile.photos[0].value, user.fbid], function (result) {
                        //void
                    });

                    return done(null, user);
                }
                else {
                    var newUser = new User();
                    newUser.fbid = profile.id;
                    newUser.fbtoken = accessToken;
                    newUser.name = profile.name.familyName + ' ' + profile.name.givenName;
                    newUser.email = profile.emails[0].value;
                    newUser.picurl = profile.photos[0].value;

                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                    //console.log(profile);
                    console.log("NEWUSER:  " + profile.emails[0].value);
                }
            });
        });
    }
));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/users/details',
        failureRedirect: 'users/login'
    }));

passport.serializeUser(function (user, done) {
    done(null, user.fbid);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'Kijelentkeztél.');

    res.redirect('/users/login');
});

module.exports = router;
