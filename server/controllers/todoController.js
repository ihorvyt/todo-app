import { prisma } from "../utils/prisma.js";

export const getTodos = async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId: req.userId }
        });
        res.json(todos);
    } catch (error) {
        console.error("Error while fetching the todo list:", error);
        res.status(500).json({ error: "Server error while fetching todos" });
    }
};

export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: "Task title is required" });
        }

        const todo = await prisma.todo.create({
            data: {
                title: title.trim(),
                userId: req.userId
            }
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error("Error while creating the todo:", error);
        res.status(500).json({ error: "Server error while creating todo" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const existingTodo = await prisma.todo.findFirst({
            where: {
                id,
                userId: req.userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ error: "Task not found" });
        }

        const updateData = {};
        if (title !== undefined && typeof title === 'string' && title.trim().length > 0) {
            updateData.title = title.trim();
        }
        if (description !== undefined) {
            updateData.description = description.trim();
        }
        if (completed !== undefined && typeof completed === 'boolean') {
            updateData.completed = completed;
        }

        const todo = await prisma.todo.update({
            where: {
                id,
                userId: req.userId
            },
            data: updateData,
        });

        res.json(todo);
    } catch (error) {
        console.error("Error while updating the todo:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(500).json({ error: "Server error while updating todo" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const existingTodo = await prisma.todo.findFirst({
            where: {
                id,
                userId: req.userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ error: "Task not found" });
        }

        await prisma.todo.delete({
            where: {
                id,
                userId: req.userId
            }
        });

        res.json({ message: "Task successfully deleted" });
    } catch (error) {
        console.error("Error while deleting the todo:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(500).json({ error: "Server error while deleting todo" });
    }
};