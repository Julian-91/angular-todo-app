import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Todo, { ITodo } from '../models/Todo';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Todo.deleteMany({});
});

describe('PATCH /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
        // Create a test todo with proper typing
        const todo: ITodo = await Todo.create({
            title: 'Original Title',
            isCompleted: false,
            category: 'Test'
        }) as ITodo;  // Assert the type as ITodo

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
        expect(response.body.isCompleted).toBe(false);  // Should remain unchanged
        expect(response.body.category).toBe('Test');    // Should remain unchanged
    });

    it('should trim title before updating', async () => {
        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .send({ title: '  Trimmed Title  ' });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Trimmed Title');
    });

    it('should return 400 for empty title', async () => {
        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .send({ title: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Title cannot be empty');
    });

    it('should return 400 for invalid todo ID format', async () => {
        const response = await request(app)
            .patch('/api/todos/invalid-id')
            .send({ title: 'New Title' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid todo ID format');
    });

    it('should return 404 for non-existent todo', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .patch(`/api/todos/${nonExistentId}`)
            .send({ title: 'New Title' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Todo not found');
    });

    it('should handle multiple field updates correctly', async () => {
        const updates = {
            title: 'Multiple Updates',
            isCompleted: true,
            category: 'Updated Category'
        };

        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updates);
    });

    it('should preserve existing values when updating other fields', async () => {
        // First update
        await request(app)
            .patch(`/api/todos/${todoId}`)
            .send({
                title: 'First Update',
                category: 'Category One',
                isCompleted: true
            });

        // Second update with only one field
        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .send({ title: 'Second Update' });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            title: 'Second Update',
            category: 'Category One',
            isCompleted: true
        });
    });
});
