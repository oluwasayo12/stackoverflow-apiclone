const express = require('express');
const router = express.Router();
const Signup = require('../api/models/signup');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');

let passSchema = new passwordValidator();
passSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().symbols()                                 // Must have symbols
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);


router.get('/', (req, res, next) => {
    res.status(405).json();
});


router.post('/', (req, res, next) => {

    if(passSchema.validate(req.body.password) === false ) {
        res.status(400).json({
            status: 400,
            error: {
                message: 'Invalid Password. must contain uppercase, lowercase, digits and special characters. Minimum lenght is 8'
            }
        });
    }else{
        Signup.findOne({email: req.body.email})
        .exec()
        .then(user =>{
            if(user){
                res.status(400).json({
                    status: 400,
                    error: {
                        message: "Email already exist"
                    }
                });  
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        res.status(500).json({
                            status: 500,
                            error: {
                                message: err
                            }
                        });   
                    }else{
                        const signupDetails = new Signup({
                            _id: mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        signupDetails
                        .save()
                        .then(result => {
                            const response = {
                                status:201,
                                success: true,
                                userDetails: { 
                                    name: result.name,
                                    email: result.email
                                }
                            }
                            res.status(201).json(response);     
                        })
                        .catch(err => {
                            res.status(500).json({
                                status: 500,
                                error: {
                                    message: err
                                }
                            });  
                        }); 
                    }
                })
            }
        });
    }
});


module.exports = router;
