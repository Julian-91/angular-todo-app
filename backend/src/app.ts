import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todosRouter);

export default app;
