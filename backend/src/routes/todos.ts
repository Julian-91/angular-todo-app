import { Router, Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo';

const router = Router();

// GET all todos
router.get('/', async (req: Request, res: Response) => {
    try {
        const todos: ITodo[] = await Todo.find();
        res.json(todos);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new todo
router.post('/', async (req: Request, res: Response) => {
    const { title, isCompleted, category } = req.body;
    const todo = new Todo({
        title,
        isCompleted: isCompleted || false,
        category: category || 'General',
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a todo
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH update a todo
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTodo);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;