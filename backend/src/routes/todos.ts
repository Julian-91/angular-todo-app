import { Router, Request, Response, RequestHandler } from 'express';
import Todo, { ITodo } from '../models/Todo';
import mongoose from 'mongoose';

interface TodoBody {
    title?: string;
    isCompleted?: boolean;
    category?: string;
}

type TodoParams = {
    id: string;
}

const router = Router();

// GET all todos
const getAllTodos: RequestHandler = async (_req, res) => {
    try {
        const todos: ITodo[] = await Todo.find();
        return res.json(todos);
    } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Error fetching todos' });
    }
};

// POST create a new todo
const createTodo: RequestHandler<{}, any, TodoBody> = async (req, res) => {
    const { title, isCompleted, category } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const todo = new Todo({
            title,
            isCompleted: isCompleted || false,
            category: category || 'General',
        });

        const newTodo = await todo.save();
        return res.status(201).json(newTodo);
    } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Error creating todo' });
    }
};

// DELETE a todo
const deleteTodo: RequestHandler<TodoParams> = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(500).json({ message: 'Invalid todo ID' });
        }

        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        return res.json({ message: 'Todo deleted' });
    } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Error deleting todo' });
    }
};

// PATCH update a todo
const updateTodo: RequestHandler<TodoParams, any, TodoBody> = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(500).json({ message: 'Invalid todo ID' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(400).json({ message: 'Todo not found' });
        }

        return res.json(updatedTodo);
    } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Error updating todo' });
    }
};

// Route handlers
router.get('/', getAllTodos);
router.post('/', createTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id', updateTodo);

export default router;