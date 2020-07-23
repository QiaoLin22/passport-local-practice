const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var routes = require('./routes');
const connection = require('./config/database');
const Mongosession = require('connect-mongo')(session);

require('dotenv').config();
require('./config/passport');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'jade')


const sessionStore = new Mongosession({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 5 * 1 
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
app.listen(3000);