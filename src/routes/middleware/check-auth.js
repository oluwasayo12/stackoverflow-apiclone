const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try{
		const authToken = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(authToken, 'r5EYOMAfYA@4');
		req.userData = decoded;
		next();
	}catch (error){
        res.status(401).json({
            status: 401,
            error: {
                message: 'Authentication failed'
            }
        }); 
	}
} 