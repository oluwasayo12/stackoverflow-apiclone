const express = require('express');
const router = express.Router();
const Question = require('../api/models/question');
const ansQuestion = require('../api/models/ansQuestion');
const User = require('../api/models/signup');

router.get('/', (req, res, next) => {
    res.status(405).json();
});

//search based on type
router.post('/', (req, res, next) => {
    var searchType = req.body.searchType;
    var searchValue = req.body.searchValue;

    if(searchType == 'question'){
        Question.find({$text: {$search: searchValue}})
        .select("_id title question tags votes")
        .exec()
        .then(question =>{
            const response = {
                status:201,
                success: true,
                questionDetails: { 
                    id: question._id,
                    title: question.title,
                    question: question.question,
                    tags: question.tags,
                    votes: question.votes
                }
            }
            res.status(201).json(response);
        }).catch(err => {
            res.status(400).json({
                status: 400,
                error: {
                    message: "Invalid search id provided"
                }
            });  
        })
    }else if(searchType == 'answer'){
        ansQuestion.find({$text: {$search: searchValue}})
        .select("_id title question votes")
        .exec()
        .then(questionAns =>{
           Question.findById({_id: questionAns.quesId})
           .exec()
           .then(result =>{
                const response = {
                    status:201,
                    success: true,
                    Details: { 
                        question:{
                            id: result._id,
                            title: result.title,
                            question: result.question,
                            votes: result.votes
                        },
                        answer:{
                            id: questionAns._id,
                            quesId: questionAns.quesId,
                            answer: questionAns.answer,
                        }
                    }
                }
                res.status(201).json(response);
           })
        }).catch(err => {
            res.status(400).json({
                status: 400,
                error: {
                    message: "Invalid search id provided"
                }
            });  
        })
    }else if(searchType == 'user'){
        User.find({$text: {$search: searchValue}})
        .select("_id name email")
        .exec()
        .then(user =>{
            const response = {
                status:201,
                success: true,
                userDetails: { 
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
            res.status(201).json(response);
        }).catch(err => {
            res.status(400).json({
                status: 400,
                error: {
                    message: "Invalid search id provided"
                }
            });  
        })
    }else{
        res.status(400).json({
            status: 400,
            error: {
                message: 'SearchType not supported',
                supportedSearch: 'question, answer, user',
                method: 'POST'
            }
        }); 
    }
});


module.exports = router;