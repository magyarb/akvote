/**
 * Created by balazs on 3/6/2017.
 */
var env = require("../env").env;
var express = require('express');
var router = express.Router();
var db = require("../postgres");

router.get('/', ifEndedVoting, function (req, res) {
    db.runq("BEGIN;SELECT show_results('cur');FETCH ALL IN \"cur\"; COMMIT;", null, function (result) {
        var arr = result.rows.slice(1);
        res.render('results',
            {
                arr: arr,
                isak: req.user.isAK,
                ishok: req.user.isHOK
            });
    });
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