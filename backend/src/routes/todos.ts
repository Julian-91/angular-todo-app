import { Router, Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo';
import mongoose from 'mongoose';

const router = Router();

// GET all todos
router.get('/', async (req: Request, res: Response) => {
    try {
        const todos: ITodo[] = await Todo.find();
        res.json(todos);
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error fetching todos' });
    }
});

// POST create a new todo
router.post('/', async (req: Request, res: Response) => {
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
        res.status(201).json(newTodo);
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error creating todo' });
    }
});

// DELETE a todo
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(500).json({ message: 'Invalid todo ID' });
        }

        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error deleting todo' });
    }
});

// PATCH update a todo
router.patch('/:id', async (req: Request, res: Response) => {
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

        res.json(updatedTodo);
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error updating todo' });
    }
});

export default router;