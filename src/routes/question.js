const express = require('express');
const router = express.Router();
const Question = require('../api/models/question');
const mongoose = require('mongoose');
const checkAuth  = require('../routes/middleware/check-auth');


router.get('/', (req, res, next) => {
    Question.find()
    .select("_id title question tags votes")
    .exec()
    .then(result =>{
        const response = {
            status:200,
            success: true,
            questionDetails: result
        }
        res.status(200).json(response);  
    })
    .catch(err => {
        res.status(500).json({
            status: 500,
            error: {
                message: err
            }
        });  
    }); 
});

router.post('/', checkAuth, (req, res, next) => {
    const questionDetails = new Question({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        question: req.body.question,
        tags: req.body.tags
    });
    questionDetails
    .save()
    .then(result => {
        const response = {
            status:201,
            success: true,
            questionDetails: { 
                title: result.title,
                question: result.question,
                tags: result.tags
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
});

// router.post('/:id', checkAuth, (req, res, next) => {

// });

module.exports = router;