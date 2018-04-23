const mongoose = require('mongoose');

var User = mongoose.model('User',{
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
        minlength  :1
    }
});


module.exports = {
    User
}

