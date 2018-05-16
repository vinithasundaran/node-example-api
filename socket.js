const { generateMessage} = require('./utils/message');

var emailEvents =  (io,user) => {
    io.on('connection', (socket) => {
        console.log('New server connection');

        socket.emit('newEmailMessage', generateMessage(user.email, 'User', 'Create', user.id));
    })

};

module.exports = {
    emailEvents
}