
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var path = require('path');
mongoose.connect(configDB.url); 
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser()); 
app.set('view engine', 'ejs'); 
app.use(session({secret: 'ilovescodetheworld'}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

require('./app/routes.js')(app, passport); 
app.listen(port);
require('./config/passport')(passport);