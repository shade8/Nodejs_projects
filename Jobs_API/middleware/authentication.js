const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // all the route handlers(controllers), whose routes are using this middleware will be able to access the req.user
        req.user = {userId: payload.userId, name: payload.name};
        next(); // so thatexecution will go to job routes after this middleware is executed
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }

};

module.exports = auth;