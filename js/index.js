var socket = io();

socket.on('connect',() =>{
    console.log('client connected to server');
});

socket.on('newEmailMessage', (message) =>{
    console.log(message);
    var formattedDate = moment(message.createdAt).format("h:mm a");
    var response = JSON.stringify(message,undefined,2);
    console.log('Response',response);

});