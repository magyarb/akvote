/**
 * Created by balazs on 2/28/2017.
 */
var pg = require('pg');
var env = require("./env").env;

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = env.postgresSettings;


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients

var pool = new pg.Pool(config);

var runq = function runq(querystring, params, cb) {
    var res = null;
    pool.connect(function (err, client, done) {
        if (err) {
            console.log(err);
        }
        //ide
        client.query(querystring, params, function (err, result) {

            if (err) {
                console.log(err);
                return (null);

            }
            res = result;
            done();
            cb(res);
        });
    });
}

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
/*
 pool.connect(function (err, client, done) {
 if (err) {
 return console.error('error fetching client from pool', err);
 }
 client.query('SELECT $1::int AS number', ['1'], function (err, result) {
 //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
 done(err);

 if (err) {
 return console.error('error running query', err);
 }
 console.log(result.rows[0].number);
 //output: 1
 });
 });

 pool.connect(function (err, client, done) { //2
 if (err) {
 return console.error('error fetching client from pool', err);
 }
 client.query('SELECT	NAME FROM	PUBLIC.testt',
 function (err, result) {
 //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
 done(err);

 if (err) {
 return console.error('error running query', err);
 }
 result.rows.forEach(function(entry) {
 console.log(entry.name);
 });
 console.log(result.rows.length);
 //output: 1
 });
 });

 */
pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
})

module.exports.runq = runq;