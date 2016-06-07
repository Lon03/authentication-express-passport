const LocalStrategy = require('passport-local').Strategy
    , User = require('../models/user');

module.exports = function(passport) {
    /**
     * Passport needs to be able to serialize and
     * deserialize users to support
     * persistent login sessions.
     */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-registration', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({ 'local.email':  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('registration-message', 'Sorry! This email is busy.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email':  email }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('message-login', 'Sorry! This user name is not found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('message-login', 'The password is not correct'));
                return done(null, user);
            });
        }));
};
