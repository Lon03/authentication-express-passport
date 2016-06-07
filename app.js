const express = require('express')
    , passport = require('passport')
    , path = require('path')
    , mongoose = require('mongoose')
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , flash = require('connect-flash');


var   routes = require('./routes/index')
    , users = require('./routes/users');


var db = mongoose.connect('mongodb://127.0.0.1:27017/user');
mongoose.connection.once('connected', function() {
    console.log("Connected to database 127.0.0.1:27017/user")
});


var app = express();
//view engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use("/public",express.static(__dirname + "/public"));

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'one' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * Initialize Passport
 */
require('./service/passport')(passport);

app.use('/', routes);
app.use('/users', users);

/**
 * catch 404 and forward to error handler.
 */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.listen(3000);

