
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const validator = require('express-validator');




var mongoose = require('./db/mongodb');
var {User} = require('./lib/model/user');

var app = express();

app.use(bodyParser.json());
app.use(validator());

// app.post('/api/users',(req,res) =>{
//     if(!req.body.name || !req.body.email) {
//         return res.send({"status": "error", "message": "Missing  parameter"});
//     }
//     req.checkBody('name',"Name should be a string").isString();
//     req.checkBody("email","Enter a valid Email address").isEmail();

//     var newUser = new User({
//       name : req.body.name,
//       email : req.body.email
//     });
//     var errors = req.validationErrors();
//     console.log(errors);
//     if (errors) {
//         res.status(400).send();
//     } else {
//         newUser.save().then((users)=>{
//             res.send(users);
//           }, (error)=>{
//             res.status(400).send();

//         });
//     }

// });


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
    return res.status(404).send({status:404, message: 'ID not valid'});
    User.findById(id).then(() =>{
        res.send(JSON.stringify(user,undefined,2));
    }).catch((error)=>{
        res.status(400).send({status:400, message: 'Bad request'});
    });
});


app.delete('/api/users/:id',(req,res) =>{
    var id = req.params.id;
    if(!ObjectID.isvalid(id))
        return res.status(404).send({status:404, message: 'ID not valid'});
    User.findByIdAndRemove(id).then(() =>{
        res.send(JSON.stringify(user,undefined,2));
    }).catch((error)=>{
        res.status(400).send({status:400, message: 'Bad request'});
    });
});

app.patch('/api/users/:id', (req,res) =>{
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send({status:404, message: 'ID not valid'});

    var body = _.pick(req.body,['name']);

    User.findByIdAndUpdate(id,{$set:body},{new:true}).then((result)=>{
        if(!result) {
            return res.status(404).send({"message" : "Nothing to update"})
        }
        res.send(JSON.stringify(result,undefined,2));
    }).catch(()=>{
        res.status(400).send({status:400, message: 'Bad request'});
    })
});

app.post('/api/users', (req,res) =>{
    var body = _.pick(req.body,['name','email','password']);
    var newUser = new User(body);
    newUser.save().then((users)=>{
        res.send(JSON.stringify(users,undefined,2));
      }).catch( (error)=>{
        res.status(400).send(error);
    });
});

app.listen('3000',()=>{
    console.log('Conected to server');
});

