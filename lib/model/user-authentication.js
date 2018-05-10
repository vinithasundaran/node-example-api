const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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
    tokens : [{
        access : {
            type : String,
            required: true,
        },
        token : {
            type : String,
            required: true,
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({
        _id : user._id.toHexString(),
        access
    }, "secret").toString();
    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() =>{
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    var decoded;
    try{
        decoded = jwt.verify(token,"secret");
    } catch (e) {

    }

   return  User.findOne({
        '_id' : decoded._id,
        'tokens.access' : 'auth',
        'tokens.token' : token
    })
   
}

var User = mongoose.model('User', UserSchema);


module.exports = {
    User
}

