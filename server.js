const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const validator = require('express-validator');

var mongoose = require('./db/mongodb');
var {User} = require('./lib/model/user');

var app = express();

app.use(bodyParser.json());
app.use(validator());

app.post('/api/users',(req,res) =>{
    req.check(req.body.email,"Enter a valid Email address").isEmail();
    var newUser = new User({
      name : req.body.name,
      email : req.body.email
    });
    var errors = req.validationErrors();
    if (errors) {
      res.send(errors);
      return;
    } else {
        newUser.save().then((users)=>{
            res.send(users);
          }, (error)=>{
            res.status(400).send();
          });
    }
  
});


app.get('/api/users',(req,res) => {
   User.find().then((users) => {
    res.send(users);
   },(e) =>{
       res.send(e);
   })
});

app.get('/api/user/:id', (req,res) =>{
    var id = req.params.id;
    if(!ObjectID.isvalid(id))
        return res.status(404).send();
    User.findById(id).then(() =>{
        res.send(JSON.stringify(user,undefined,2));
    }).catch((error)=>{
        res.status(400).send();
    });
});

app.listen('3000',()=>{
    console.log('Conected to server');
});

