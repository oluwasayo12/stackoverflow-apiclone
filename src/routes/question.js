const express = require('express');
const router = express.Router();
const Question = require('../api/models/question');
const ansQuestion = require('../api/models/ansQuestion');
const mongoose = require('mongoose');
const checkAuth  = require('../routes/middleware/check-auth');

//Get questions
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

//Post a new question
router.post('/', checkAuth, (req, res, next) => {
    const questionDetails = new Question({
        _id: mongoose.Types.ObjectId(),
        userId: req.userData.userId,
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
            totalQuestions: result.length,
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

// votes questions
router.patch('/:id', checkAuth, (req, res, next) => {

    var voteType = req.body.voteType;
    var value = req.body.value;

    Question.findById({_id: req.params.id})
    .exec()
    .then(question =>{
        if(question._id != ''){
            const currentVote = (question.votes || 0);

            if(value == 1){
                if(voteType == 'upvote'){
                    var newvote = currentVote + value;
                }else if(voteType == 'downvote'){
                    var newvote = currentVote - value;
                }else{
                    res.status(400).json({
                        status: 400,
                        error: {
                            message: 'Invalid vote type'
                        }
                    }); 
                }  
                var query = { _id: question._id };
                Question.updateOne(query, { votes: newvote })
                .then(result => {
                    const response = {
                        status:201,
                        success: true,
                        questionDetails: { 
                            title: question.title,
                            question: question.question,
                            tags: question.tags,
                            votes: newvote
                        }
                    }
                    res.status(201).json(response);     
                })
                .catch(err => {
                    res.status(400).json({
                        status: 400,
                        error: {
                            message: err
                        }
                    });  
                })
            }else{
                res.status(400).json({
                    status: 400,
                    error: {
                        message: 'Votes value has to be equal to one(1)'
                    }
                });  
            }

        }else{
                res.status(400).json({
                    status: 400,
                    error: {
                        message: "Question doesn't exist. "
                    }
                });     
            }
    })
    .catch(err => {
        res.status(400).json({
            status: 400,
            error: {
                message: err
            }
        });  
    });
});


//answer a question
router.post('/:id', checkAuth, (req, res, next) => {
    var quesId = req.params.id;
    var answer = req.body.answer;

    Question.findById({_id: quesId})
    .exec()
    .then(question =>{
        if(question._id != ''){
            const questionAns = new ansQuestion({
                _id: mongoose.Types.ObjectId(),
                userId: req.userData.userId,
                quesId: quesId,
                answer: answer
            });
            questionAns
            .save()
            .then(result => {
                ansQuestion.find({quesId: quesId})
                .select("_id userId quesId answer")
                .exec()
                .then(result =>{
                    const response = {
                        status:201,
                        success: true,
                        totalAnswers: result.length,
                        answerDetails: result
                    }
                    res.status(201).json(response);  
                });
            });
        }else{
            res.status(400).json({
                status: 400,
                error: {
                    message: "Invalid question ID. "
                }
            }); 
        }
    })
    .catch(err => {
        res.status(400).json({
            status: 400,
            error: {
                message: err
            }
        });  
    });

});




module.exports = router;