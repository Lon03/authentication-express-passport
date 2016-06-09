const express  = require('express');
const passport = require('passport');
const router   = express.Router();


router.get('/', function(req, res) {
    res.render('login.ejs', { message: req.flash('message-login') });
});

router.get('/registration', function(req, res) {
    res.render('registration.ejs', { message: req.flash('registration-message') });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user: req.user });
});

router.post('/registration', passport.authenticate('local-registration', {
    successRedirect: '/profile',
    failureRedirect: '/registration',
    failureFlash: true
}));

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
