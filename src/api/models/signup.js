const mongoose = require('mongoose');

const signupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: {
        type: String, 
        required: [true, 'email field is required'], 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String, 
        required: [true, 'password field is required']
    }
});

signupSchema.index({name: 'text', 'email': 'text'});

module.exports = mongoose.model("Signup", signupSchema);