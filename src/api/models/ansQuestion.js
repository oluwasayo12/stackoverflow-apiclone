const mongoose = require('mongoose');

const ansQuestionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    quesId: {
        type: String,
        required: [true, 'Invalid question ID']
    },
    answer: {
        type: String, 
        required: [true, 'Kindly provide an answer to the question']
    }
});

ansQuestionSchema.index({answer: 'text'});

module.exports = mongoose.model("ansQuestion", ansQuestionSchema);