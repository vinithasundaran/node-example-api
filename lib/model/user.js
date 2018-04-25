const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        minlength : 1,
        errorMessage: 'Error'

    },
    email : {
        type : String,
        required : true,
        trim : true,
        minlength  :1,
        unique :true,
        validate: {
            validator:validator.isEmail,
            message: '{VALUE} is not valid'
        }
    },
    password : {
        type : String,
        required: true,
        minlength : 6 
    },
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};

var User = mongoose.model('User', UserSchema);


module.exports = {
    User
}

