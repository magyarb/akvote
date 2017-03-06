/**
 * Created by balazs on 2/28/2017.
 */

var db = require('../postgres');

/*

 pool.connect(function (err, client, done) {
 if (err) {
 return console.error('error fetching client from pool', err);
 }
 //ide
 });


 */

function User() {
    this.fbid = '';
    this.fbtoken = '';
    this.email = "";
    this.name = "";
    this.picurl = "";
    this.isAK = false;
    this.isHOK = false;
    this.votedfor = "";
    this.applicationpdf = "";  //need to declare the things that i want to be remembered for each user in the database

    this.save = function (callback) {
        console.log(this.email + ' will be saved');
        db.runq("INSERT INTO users(fbid, fbtoken, email, name, picurl) VALUES($1, $2, $3, $4, $5)", [this.fbid, this.fbtoken, this.email, this.name, this.picurl], function (result) {
            console.log("SAVEDusr: " + this.email);
            return callback();
        });
    };
}

User.findOne = function (fbid, callback) {
    var isNotAvailable = false; //we are assuming the email is taking
    console.log(fbid + ' is in the findOne function test');
    db.runq("SELECT * from users where fbid=$1", [fbid], function (result) {
        if (result.rows.length > 0) {
            isNotAvailable = true; // update the user for return in callback
            this.fbid = fbid;
            //password = result.rows[0].password;
            console.log(fbid + ' is not available!');
        }
        else {
            isNotAvailable = false;
            //email = email;
            console.log(fbid + ' is available');
        }

        return callback(false, isNotAvailable, this);
    });
};

User.findById = function (id, callback) {
    console.log("we are in findbyid");

    db.runq("SELECT * from users where fbid=$1", [id], function (result) {
        if (result.rows.length > 0) {
            //console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.email = result.rows[0]['email'];
            user.fbtoken = result.rows[0]['fbtoken'];
            user.fbid = result.rows[0]['fbid'];
            user.name = result.rows[0]['name'];
            user.picurl = result.rows[0]['picurl'];
            user.isAK = result.rows[0]['isak'];
            user.isHOK = result.rows[0]['ishok'];
            user.votedfor = result.rows[0]['votedfor'];
            user.applicationpdf = result.rows[0]['applicationpdf'];
            console.log("FOUND BY ID: " + user.email);
            return callback(null, user);
        }
    });

};

//User.connect = function(callback){
//    return callback (false);
//};

//User.save = function(callback){
//    return callback (false);
//};

module.exports = User;