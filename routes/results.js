/**
 * Created by balazs on 3/6/2017.
 */
var env = require("../env").env;
var express = require('express');
var router = express.Router();
var db = require("../postgres");

router.get('/', ifEndedVoting, function (req, res) {
    try{
    db.runq("BEGIN;SELECT show_results2('cur');FETCH ALL IN \"cur\"; COMMIT;", null, function (result) {
        try {
            var arr = result[2].rows;
            res.render('results',
                {
                    arr: arr,
                    isak: req.user.isAK,
                    ishok: req.user.isHOK
                });
        }
        catch(e) {
            req.flash('error_msg', 'Hiba történt az eredmények listázása közben.');
            res.redirect('/users/details');
        }
    });
    }
    catch (e)
    {
        req.flash('error_msg', 'Be kéne jelentkezni.');
        res.redirect('/users/login');
    }
});

function ifEndedVoting(req, res, next) {
    var now = new Date();
    if (env.votingEnds < now) {
        return next();
    } else {
        req.flash('error_msg', 'Még nincs vége a szavazási időszaknak.');
        res.redirect('/users/details');
    }
}

module.exports = router;