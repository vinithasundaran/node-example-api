const {User} = require('./../lib/model/user-authentication');

var verifyUser = (req,res,next) =>{
    var token = req.header('x-auth');
    if(!token) {
        return res.status(401).send({ status: 401, message: 'Authorisation failed' });
    }
    User.findByToken(token).then((user)=>{
        console.log('User is ',user);
        console.log('User admin  ',user.admin);
        if((!user) || (user && !user.admin)) {
           return Promise.reject();
        }
        req.user = user;
        req.token = token;
        
        next();
   }).catch((error) => {
    res.status(401).send({ status: 401, message: 'Authorisation failed' });
   });
}

module.exports ={
    verifyUser
}