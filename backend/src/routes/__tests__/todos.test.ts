import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Todo, { ITodo } from '../../models/Todo';
import '../../test/setup';

describe('Todo Routes', () => {
    describe('PATCH /api/todos/:id', () => {
        let todoId: string;

        beforeEach(async () => {
            const todo: ITodo = await Todo.create({
                title: 'Original Title',
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
                    isCompleted: true,
                    category: 'Work'
                });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
            expect(response.body.isCompleted).toBe(true);
            expect(response.body.category).toBe('Work');
        });

        it('should allow partial updates', async () => {
            const response = await request(app)
                .patch(`/api/todos/${todoId}`)
                .send({ title: 'Only Title Updated' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Only Title Updated');
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
