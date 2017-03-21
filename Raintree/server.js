// modules =================================================
var express        = require('express');
var app            = express();
var mysql       = require('mysql');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var Session = require('express-session');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
// configuration ===========================================
	
// config files
var db = require('./config/db');
var connection_object= new db();
var connection=connection_object.connection; // getting conncetion object here

// the session is stored in a cookie, so we use this to parse it
app.use(cookieParser());

app.use(multipart({
    uploadDir: './public/images/slider'
}));

var Session= Session({
    secret:'secrettokenhere',
    saveUninitialized: true,
    resave: true
});
app.use(Session);

var sessionInfo;

var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes
//Services
require('./app/services.js')(app,connection,Session,cookieParser,sessionInfo);
// start app ===============================================
app.listen(port);	
console.log('Server started on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app