const {User} = require('./../js/libs/model/user-authentication');

var authenticate = (req,res,next) =>{
    var token = req.header('x-auth');
    if(!token) {
        return res.status(401).send({ status: 401, message: 'Authorisation failed' });
    }
    User.findByToken(token).then((user)=>{
        if(!user) {
            Promise.reject();
        }
        req.user = user;
        req.token = token;
        
        next();
    }).catch((error)=>{
        res.status(401).send({ status: 401, message: 'Authorisation failed' });
    })
}
 

module.exports ={
    authenticate
}