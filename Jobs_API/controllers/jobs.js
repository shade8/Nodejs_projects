const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../errors');
const { use } = require('express/lib/router');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
};

const getJob = async (req, res) => {
    // jobId is a alias
    const {user:{userId}, params:{id:jobId}}= req;
    const job = await Job.findOne({_id:jobId, createdBy: userId});
    // when the userid is correct , but the jobid provided is wrong
    if(!job) {
        throw new NotFoundErrorError(`no job found with ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
};

const updateJob = async (req, res) => {
    const {user:{userId}, params:{id:jobId}, body:{company, position}} = req;

    if(company === '' || position === '') {
        throw new BadRequestError('compay or position fields cant be empty');
    }

    const updatedJob = await Job.findOneAndUpdate({_id:jobId, createdBy:userId}, req.body, {new: true, runValidators: true});

    // when the userid is correct , but the jobid provided is wrong
    if(!updatedJob){
        throw new NotFoundError(`no job with the id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(updatedJob);
};

const deleteJob = async (req, res) => {
    const {user:{userId}, params:{id:jobId}} = req;
    const job = await Job.findOneAndDelete({_id: jobId, createdBy: userId});
    if(!job){
        throw new NotFoundError(`no job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {getAllJobs, getJob, createJob, updateJob, deleteJob};