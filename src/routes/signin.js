const express = require('express');
const router = express.Router();
const User = require('../api/models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
    res.status(405).json();
});

router.post('/', (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if(user == null ){
                res.status(401).json({
                    status: 401,
                    error: {
                        message: 'Authentication failed'
                    }
                });  
            }else{
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if(err){
                        res.status(401).json({
                            status: 401,
                            error: {
                                message: 'Authentication failed'
                            }
                        });  
                    }else if(result){

                        const token = jwt.sign({userId: user._id, displayName: user.name},'r5EYOMAfYA@4',{expiresIn: "1h"});

                        res.status(200).json({
                            status: 200,
                            message: 'Auth successful',
                            data: {
                                token: token
                            }
                        });
                    }else {
                        res.status(401).json({
                            status: 401,
                            error: {
                                message: 'Authentication failed'
                            }
                        }); 
                    } 
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                error: {
                    message: err
                }
            });  
        })
});



module.exports = router;