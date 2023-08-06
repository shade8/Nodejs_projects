const jwt = require('jsonwebtoken');
const {BadRequestError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const login = async (req, res) => {
    const {username, password} = req.body;
    // console.log(username, password);
    if(!username || !password) {
        throw new BadRequestError('please provide username and password');
    } 

    // just for demo, we take date as Id, normally we get id from db
    const id = new Date().getDate();
    // try to keep payload (1st arg) small
    // just for deleteModel, in production we have to use login, complex and unguessable string value!!!!!
    const token = jwt.sign({id, username}, process.env.JWT_SECRET,{expiresIn: '300d'});
    
    res.status(StatusCodes.OK).json({msg:'user created', token})
}

const dashboard = async (req, res) => {
    const luckyNumber = Math.floor(Math.random() * 100);

        res
            .status(StatusCodes.OK)
            .json({
            msg: `hello, ${req.user.username}`,
            secret: `here is your authorized data, you're lucky number is ${luckyNumber}`,
            })

}

module.exports = {login, dashboard};