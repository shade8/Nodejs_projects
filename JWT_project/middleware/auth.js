const jwt = require("jsonwebtoken");
const {UnauthenticatedError} = require('../errors');

const authMiddleware = async (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth || !auth.startsWith('Bearer ')){
        throw new UnauthenticatedError('no token provided');
    }
    // get the element at index 1 of the split array
    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {id, username} = decoded;
        req.user = {id, username};
        next();
    } catch (error) {
        throw new UnauthenticatedError('not authorized to access this route')
    }
};

module.exports = authMiddleware;
