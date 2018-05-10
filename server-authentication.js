
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const validator = require('express-validator');




var mongoose = require('./db/mongodb');
var { User } = require('./lib/model/user-authentication');

var app = express();

app.use(bodyParser.json());
app.use(validator());


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

app.get('/api/user/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ status: 404, message: 'ID not valid' });
    }
    User.findById(id).then(() => {
        res.send(JSON.stringify(user, undefined, 2));
    }).catch((error) => {
        res.status(400).send({ status: 400, message: 'Bad request' });
    });
});


app.delete('/api/users/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ status: 404, message: 'ID not valid' });
    }
    User.findByIdAndRemove(id).then(() => {
        res.send(JSON.stringify(user, undefined, 2));
    }).catch((error) => {
        res.status(400).send({ status: 400, message: 'Bad request' });
    });
});

app.patch('/api/users/:id', (req, res) => {
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

app.post('/api/users', (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        console.log('User',user);
        res.header('x-auth',token).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.get('/users/me' , (req,res) =>{
    var token = req.header('x-auth');
    console.log('Token from header',token);
    User.findByToken(token).then((user)=>{
        if(!user) {
            return res.status(404).send({ "message": "Token not found" });
        }
        res.send(user);
    });

});

app.post('/users/me',(req,res)=>{

});

app.listen('3000', () => {
    console.log('Conected to server');
});

