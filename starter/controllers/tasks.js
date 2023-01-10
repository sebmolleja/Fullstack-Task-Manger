const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')

const getAllTasks = asyncWrapper( async (req, res) => { // (1)
    
    const tasks = await Task.find({})
    res.status(200).json({tasks: tasks})
    //res.status(200).json({tasks: tasks, amount: tasks.length})
    //res.status(200).json({status: "success", data: {tasks, nbHits: tasks.length}})
})

const createTask = asyncWrapper( async (req, res) => { // (2)
    
    const task = await Task.create(req.body)
    res.status(201).json({task})
})

const getTask = asyncWrapper( async (req, res, next) => { // (3)
    
    const {id: taskID} = req.params
    const task = await Task.findOne({_id: taskID})
    if (!task) {
        return next(createCustomError(`No task with id: ${taskID}`, 404))
    }
    
    res.status(200).json({task})
})


const deleteTask = asyncWrapper( async (req, res) => { // (5)
    
    const {id: taskID} = req.params;
    const task = await Task.findOneAndDelete({_id: taskID});
    if (!task) {
        return next(createCustomError(`No task with id: ${taskID}`, 404))
    }
    res.status(200).json({task})
    //res.status(200).send()
    //res.status(200).json({task: null, status: 'success'})
})

const updateTask = asyncWrapper( async (req, res) => { // (4)
    
    const {id: taskID} = req.params;
    const task = await Task.findOneAndUpdate({_id: taskID}, req.body, {
        new: true,
        runValidators: true,
    })
    if (!task) {
        return next(createCustomError(`No task with id: ${taskID}`, 404))
    }

    res.status(200).json({task})
})

module.exports = {
    getAllTasks,
    createTask, 
    getTask,
    updateTask,
    deleteTask 
}