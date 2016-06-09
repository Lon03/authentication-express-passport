const  mongoose = require('mongoose');
const  bcrypt   = require('bcrypt-nodejs');

var userSchema  = mongoose.Schema({

    local: {
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        }
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
