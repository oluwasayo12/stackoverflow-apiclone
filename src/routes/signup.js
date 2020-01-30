const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'signup'
    });        
})

router.post('/', (req, res, next) => {
    return res.status(200).json({
        message: 'signup post'
    });        
})


module.exports = router;
