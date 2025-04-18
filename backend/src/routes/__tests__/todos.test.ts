import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Todo, { ITodo } from '../../models/Todo';
import '../../test/setup';

describe('Todo Routes', () => {
    describe('POST /api/todos', () => {
        it('should create a todo with description', async () => {
            const newTodo = {
                title: 'New Todo',
                description: 'This is a test description',
                category: 'Work',
                isCompleted: false
            };

            const response = await request(app)
                .post('/api/todos')
                .send(newTodo);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(newTodo.title);
            expect(response.body.description).toBe(newTodo.description);
            expect(response.body.category).toBe(newTodo.category);
            expect(response.body.isCompleted).toBe(newTodo.isCompleted);
        });

        it('should create a todo without description', async () => {
            const newTodo = {
                title: 'New Todo without description',
                category: 'Personal'
            };

            const response = await request(app)
                .post('/api/todos')
                .send(newTodo);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(newTodo.title);
            expect(response.body.description).toBe(''); // Default value
            expect(response.body.category).toBe(newTodo.category);
            expect(response.body.isCompleted).toBe(false); // Default value
        });
    });

    describe('PATCH /api/todos/:id', () => {
        let todoId: string;

        beforeEach(async () => {
            const todo: ITodo = await Todo.create({
                title: 'Original Title',
                description: 'Original description',
                isCompleted: false,
                category: 'Test'
            }) as ITodo;

            todoId = todo._id.toString();
        });

        it('should update a todo successfully', async () => {
            const response = await request(app)
                .patch(`/api/todos/${todoId}`)
                .send({
                    title: 'Updated Title',
                    description: 'Updated description',
                    isCompleted: true,
                    category: 'Work'
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
            expect(response.body.description).toBe('Updated description');
            expect(response.body.isCompleted).toBe(true);
            expect(response.body.category).toBe('Work');
        });

        it('should update only the description field', async () => {
            const response = await request(app)
                .patch(`/api/todos/${todoId}`)
                .send({ description: 'Only description updated' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Original Title');
            expect(response.body.description).toBe('Only description updated');
            expect(response.body.isCompleted).toBe(false);
            expect(response.body.category).toBe('Test');
        });

        it('should allow partial updates', async () => {
            const response = await request(app)
                .patch(`/api/todos/${todoId}`)
                .send({ title: 'Only Title Updated' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Only Title Updated');
            expect(response.body.description).toBe('Original description');
            expect(response.body.isCompleted).toBe(false);
            expect(response.body.category).toBe('Test');
        });

        it('should return 404 for non-existent todo', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .patch(`/api/todos/${nonExistentId}`)
                .send({ title: 'New Title' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Todo not found');
        });

        it('should return 400 for invalid todo ID format', async () => {
            const response = await request(app)
                .patch('/api/todos/invalid-id')
                .send({ title: 'New Title' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid todo ID format');
        });
    });
});
