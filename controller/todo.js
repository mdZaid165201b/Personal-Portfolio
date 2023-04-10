const Todo = require("../model/Todo");

const createTodo = async(req, res, next) => {
    try{
        const { title, deadline, status } = req.body;
        const todoObject = new Todo({
            title,
            deadline,
            status
        });
        const response = await todoObject.save();
        res.status(201).json({
            success: true,
            response
        })
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const updateTodo = async (req, res, next) => {
    try{
        const fetchedTodo = await Todo.findById(req.params.id);
        if(fetchedTodo){
            const updateObject = {
                title: req.body.title === undefined ? fetchedTodo.title : req.body.title,
                deadline: req.body.deadline === undefined ? fetchedTodo.deadline : req.body.deadline,
                status: req.body.status === undefined ? fetchedTodo.status : req.body.status
            }
            const finalResponse = await Todo.findByIdAndUpdate(req.params.id, updateObject, {new: true});
            res.status(201).json({
                success: true,
                finalResponse
            })
        }
        else{
            res.status(404).json({
                success: false,
                message: "todo not found!!!"
            })
        }
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const deleteTodo = async (req, res, next) => {
    try{
        const fetchedTodo = await Todo.findById(req.params.id);
        if(fetchedTodo){
            await Todo.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "todo deleted successfully!!!"
            })
        }
        else{
            res.status(404).json({
                success: false,
                message: "todo not found!!!"
            })
        }
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const allTodos = async (req, res, next) => {
    try{
        const todos = await Todo.find({}).sort({deadline: -1});
        res.status(200).json({
            success: true,
            todos

        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const findTodo = async (req, res, next) => {
    try{
        const fetchedTodo = await Todo.findById(req.params.id);
        if(fetchedTodo) {
            res.status(200).json({
                success: true,
                fetchedTodo
            })
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports = {
    createTodo,
    updateTodo,
    deleteTodo,
    allTodos,
    findTodo
}