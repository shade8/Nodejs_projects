const { object } = require('joi');
const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
// const bcrypt = require('bcryptjs');
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    
    // const user = await User.create(req.body);
    // the above and below line mean the same , but if we want properties ,which are not present in the req.body, we will have to add them.in the above code line that adding is not possible. but in below code line , because we are using spread operator in a new object, we can add additional properties to the new object
    const user = await User.create({...req.body});
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequestError('please provide email and password');
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name: user.name}, token});
};


module.exports = {login, register};