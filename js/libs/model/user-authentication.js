const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({

    name: {
        type : String,
        required : true,
        minlength : 1,

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
    admin : Boolean,
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


UserSchema.pre('save',function (next){
    var user = this;
    
    if(user.isModified('password')) {
        bcrypt.genSalt(10,(error,salt) =>{
            bcrypt.hash(user.password,salt,(error,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else {
        next();
    }
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

UserSchema.methods.validatePassword = function(password) {
    var user = this;
    var validatePassword =  bcrypt.compareSync(password, user.password); 
    return validatePassword;
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,"secret");
    } catch (error) {
        return Promise.reject();
    }

   return  User.findOne({
        '_id' : decoded._id,
        'tokens.access' : 'auth',
        'tokens.token' : token
    })
   
};

UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;
    return User.findOne({email}).then((user) =>{
        if (!user) {
            return Promise.reject();
          }
        return new Promise ((resolve,reject)=>{
             bcrypt.compare(password, user.password,(error,res) =>{
                 if(res){
                     resolve(user);
                 } else {
                     reject();
                 }
             }); 
            
        });
    })
}

UserSchema.methods.removeToken = function (token) {
    var user = this;
  
    return user.update({
      $pull: {
        tokens: {token}
      }
    });
  };
  
var User = mongoose.model('User', UserSchema);


module.exports = {
    User
}

