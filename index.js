/**
 * Created by balazs on 2/28/2017.
 */

/**
 * DEPENDENCIES
 */

var env = require("./env").env;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var http = require('http');
const fileUpload = require('express-fileupload');
//var LocalStrategy = require('passport-local').Strategy;
//var mongo = require('mongodb');
//var mongoose = require('mongoose');
var url = env.addr;
//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/loginapp');
//var db = mongoose.connection;


//http.globalAgent.maxSockets = 20;
/**
 * ROUTES
 */

//var routes = require('./routes/index');
var users = require('./routes/users');
var applications = require('./routes/applications');
var vote = require('./routes/vote');
var results = require('./routes/results');
//var api = require('./routes/api');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout',helpers: {
    json: function (context) { return JSON.stringify(context); },
    szazalek: function(context){return context/100 + "%";}
}}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//upload
app.use(fileUpload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret', //ezt atirni
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

/**
 * ROUTES pt.2
 */

//app.use('/', routes);
app.use('/users', users);
app.use('/applications', applications);
app.use('/vote', vote);
app.use('/results', results);
//app.use('/api', api);

/*
app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(__dirname + '/public/index.html');
});
*/
// Set Port
app.set('port', (process.env.PORT || env.port));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});
