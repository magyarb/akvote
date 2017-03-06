/**
 * Created by balazs on 3/2/2017.
 */
//var Db = require("postgres");
/*
var db = require('./postgres');

db.runq("BEGIN;SELECT show_results('cur');FETCH ALL IN \"cur\"; COMMIT;", null, function (result) {
    console.log(result);
});*/
/*
var env = require("./env").env;

console.log(env.addr);
    */

var votingStarts = new Date("2017.03.07. 12:30:00");
var votingEnds = new Date("2017.03.08. 12:30:00");
var now = new Date();



console.log(votingStarts < now && votingEnds > now);