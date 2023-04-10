const router = require("express").Router();
const { createTodo } = require("../controller/todo");

router.post("/create-todo", createTodo);