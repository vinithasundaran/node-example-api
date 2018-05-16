
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const validator = require('express-validator');
const permission = require('permission');
const socket = require('socket.io');
const http = require('http');


const { authenticate } = require('./middleware/authenticate');
const { verifyUser } = require('./middleware/authorisation');
const mongoose = require('./db/mongodb');
const { User } = require('./js/libs/model/user-authentication');
const {emailEvents} = require('./socket');

var app = express();

app.use(bodyParser.json());
app.use(validator());

app.use(express.static(__dirname));


var server = http.createServer(app);
var io = socket(server);


app.get('/api/users', (req, res) => {
    User.find().then((users) => {
        if (!users) {
            return res.status(404).send({ "message": "Nothing to update" })
        }
        res.send(users);
    }, (e) => {
        res.send(e);
    })
});

// app.delete('/api/v1/users/:id', verifyUser, (req, res) => {
//     var id = req.params.id;
//     if (!ObjectID.isValid(id)) {
//         return res.status(404).send({ status: 404, message: 'ID not valid' });
//     }
//     User.findByIdAndRemove(id).then(() => {
//         res.send(JSON.stringify(user, undefined, 2));
//     }).catch((error) => {
//         res.status(400).send({ status: 400, message: 'Bad request' });
//     });
// });

app.patch('/api/users/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ status: 404, message: 'ID not valid' });
    }
    var body = _.pick(req.body, ['name']);

    User.findByIdAndUpdate(id, { $set: body }, { new: true }).then((result) => {
        if (!result) {
            return res.status(404).send({ "message": "Nothing to update" })
        }
        res.send(JSON.stringify(result, undefined, 2));
    }).catch(() => {
        res.status(400).send({ status: 400, message: 'Bad request' });
    })
});


// Sign up 
app.post('/api/v1/users', (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password', 'admin']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        emailEvents(io,user);
        res.header('x-auth', token).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.get('/api/v1/users/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ status: 404, message: 'ID not valid' });
    }
    User.findById(id).then((user) => {
        res.send(JSON.stringify(user, undefined, 2));
    }).catch((error) => {
        console.log(error);
        res.status(400).send({ status: 400, message: 'Bad request' });
    });
});

//Login

app.post('/api/v1/login', async (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        console.log(user);
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send({ status: 400, message: 'Invalid data' });
    });
});

app.delete('/api/v1/users/token', verifyUser, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({ status: 200, message: 'Logged out successfully' });
    }).catch((error) => {
        res.status(400).send({ status: 400, message: 'Invalid data' });
    })
});


app.get('/users/me', (req, res) => {
    var token = req.header('x-auth');
    console.log('Token from header', token);
    User.findByToken(token).then((user) => {
        if (!user) {
            return res.status(404).send({ "message": "Token not found" });
        }
        res.send(user);
    });

});



server.listen('3000', () => {
    console.log('Conected to server');
});

