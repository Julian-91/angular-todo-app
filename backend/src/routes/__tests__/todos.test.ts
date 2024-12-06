import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from '../todos';
import Todo from '../../models/Todo';

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

describe('Todo Routes', () => {
    describe('GET /api/todos', () => {
        it('should return empty array when no todos exist', async () => {
            const response = await request(app).get('/api/todos');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should return all todos when they exist', async () => {
            const testTodo = await Todo.create({
                title: 'Test Todo',
                category: 'Test'
            });

            const response = await request(app).get('/api/todos');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe('Test Todo');

            await Todo.findByIdAndDelete(testTodo._id);
        });
    });

    describe('POST /api/todos', () => {
        it('should create todo with valid data', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: 'New Todo',
                    category: 'Test'
                });

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('New Todo');
            expect(response.body.category).toBe('Test');

            // Cleanup
            await Todo.findByIdAndDelete(response.body._id);
        });

        it('should reject todo without title', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({
                    category: 'Test'
                });

            expect(response.status).toBe(400);
        });

        it('should set default category when empty', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: 'New Todo',
                    category: ''
                });

            expect(response.status).toBe(201);
            expect(response.body.category).toBe('General');

            // Cleanup
            await Todo.findByIdAndDelete(response.body._id);
        });
    });

    describe('DELETE /api/todos/:id', () => {
        it('should delete existing todo', async () => {
            // Create a todo first
            const todo = await Todo.create({
                title: 'Test Todo',
                category: 'Test'
            });

            const response = await request(app)
                .delete(`/api/todos/${todo._id}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Todo deleted');

            // Verify deletion
            const found = await Todo.findById(todo._id);
            expect(found).toBeNull();
        });

        it('should return 404 for non-existent todo', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/todos/${nonExistentId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/todos/:id', () => {
        it('should update existing todo', async () => {
            // Create a todo first
            const todo = await Todo.create({
                title: 'Test Todo',
                category: 'Test'
            });

            const response = await request(app)
                .patch(`/api/todos/${todo._id}`)
                .send({
                    title: 'Updated Todo',
                    isCompleted: true
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Todo');
            expect(response.body.isCompleted).toBe(true);

            // Cleanup
            await Todo.findByIdAndDelete(todo._id);
        });

        it('should return 404 for non-existent todo', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .patch(`/api/todos/${nonExistentId}`)
                .send({
                    title: 'Updated Todo'
                });

            expect(response.status).toBe(400);
        });
    });
});
