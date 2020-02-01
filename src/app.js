const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userSignin = require('../src/routes/signup');


mongoose.connect('mongodb+srv://softcom:8Ubvsyl9cT8WncQd@softcom-quobr.mongodb.net/test?retryWrites=true&w=majority',{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true 
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS' ){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});




app.use('/signup', userSignin );




app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
 
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;