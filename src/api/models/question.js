const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    title: {
        type: String, 
        required: [true, 'Kindly provide a title for your question']
    },
    question: {
        type: String, 
        required: [true, 'Kindly provide your question']
    },
    tags: String,
    votes: Number
});

questionSchema.index({userId: 'text', title: 'text', question: 'text' , tags: 'text'});

module.exports = mongoose.model("Question", questionSchema);