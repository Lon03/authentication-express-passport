const express      = require('express');
const passport     = require('passport');
const path         = require('path');
const mongoose     = require('mongoose');
const logger       = require('morgan');


/****************************************************
 *                  middleware
 ****************************************************/
const session      = require('express-session');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon      = require('serve-favicon');
const flash        = require('connect-flash');


/****************************************************
 *                  routes
 ****************************************************/
const routes = require('./routes/index');
const users  = require('./routes/users');

var app  = express();
var port = 3000;

var dbConfig = require('./service/db');
// Connect to DB
mongoose.connect(dbConfig.url);


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
app.use(session({
    secret: 'one'
    , resave: true
    , saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


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
 * development error handler will print stacktrace
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


app.listen(port);
console.log('Listening on ' + port);

