const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { User } = require('./lib/model/user-authentication');

var app = express();

app.use(bodyParser.json());

