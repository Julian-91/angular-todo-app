import { Router, Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo';
import mongoose from 'mongoose';

// Custom types
type AsyncRequestHandler<P = {}, ResBody = any, ReqBody = any> = (
    req: Request<P, ResBody, ReqBody>,
    res: Response<ResBody>
) => Promise<void>;

interface TodoBody {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    category?: string;
}

type TodoParams = {
    id: string;
}

const router = Router();

// GET all todos
const getAllTodos: AsyncRequestHandler = async (_req, res) => {
    try {
        const todos: ITodo[] = await Todo.find();
        res.json(todos);
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error fetching todos' });
    }
};

// POST create a new todo
const createTodo: AsyncRequestHandler<{}, any, TodoBody> = async (req, res) => {
    const { title, description, isCompleted, category } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
        res.status(400).json({ message: 'Title is required' });
        return;
    }

    try {
        const todo = new Todo({
            title,
            description: description || '',
            isCompleted: isCompleted || false,
            category: category || 'General',
        });

        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error creating todo' });
    }
};

// DELETE a todo
const deleteTodo: AsyncRequestHandler<TodoParams> = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid todo ID format' });
            return;
        }

        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }

        res.json({ message: 'Todo deleted' });
    } catch (err: any) {
        res.status(500).json({ message: err.message || 'Error deleting todo' });
    }
};

// PATCH update a todo
const updateTodo: AsyncRequestHandler<TodoParams, any, TodoBody> = async (req, res) => {
    const { title, description, isCompleted, category } = req.body;

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid todo ID format' });
            return;
        }

        // Find the todo first to check if it exists
        const existingTodo = await Todo.findById(req.params.id);
        if (!existingTodo) {
            res.status(404).json({ message: 'Todo not found' });
            return;
        }

        // Validate title if it's being updated
        if (title !== undefined && title.trim().length === 0) {
            res.status(400).json({ message: 'Title cannot be empty' });
            return;
        }

        // Build update object with only provided fields
        const updateData: TodoBody = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description;
        if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
        if (category !== undefined) updateData.category = category;

        // Update todo with validation
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,          // Return the updated document
                runValidators: true // Run model validators
            }
        );

        res.json(updatedTodo);
    } catch (err: any) {
        // Handle different types of errors
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: err.message || 'Error updating todo' });
        }
    }
};

// Route handlers
router.get('/', getAllTodos);
router.post('/', createTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id', updateTodo);

export default router;