const express = require('express');
const router = express.Router();
const Signup = require('../api/models/signup');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
    res.status(405).json();
});


router.post('/', (req, res, next) => {
    Signup.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length >= 1){
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
});


module.exports = router;
