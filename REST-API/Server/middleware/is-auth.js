const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader) {
        const error = new Error('Not authenticated😢');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(authHeader, 'somesupersecretsecretkey');
        req.userId = decodedToken;
        next();
    }
    catch(err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken) {
        const error = new Error("Not authenticated😢");
        error.statusCode = 401;
        throw error;
    }
};