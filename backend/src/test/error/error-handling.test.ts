import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from '../../routes/todos';
import Todo from '../../models/Todo';

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

describe('Error Handling Tests', () => {
    describe('Database Connection Errors', () => {
        let originalConnect: typeof mongoose.connect;

        beforeAll(() => {
            originalConnect = mongoose.connect;
        });

        afterAll(() => {
            mongoose.connect = originalConnect;
        });

        it('should handle database connection errors', async () => {
            // Mock mongoose connect to simulate connection error
            mongoose.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));

            const response = await request(app).get('/api/todos');
            expect(response.status).toBe(500);
        });
    });

    describe('Invalid ObjectId Handling', () => {
        it('should handle invalid ObjectId in delete request', async () => {
            const response = await request(app)
                .delete('/api/todos/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBeDefined();
        });

        it('should handle invalid ObjectId in update request', async () => {
            const response = await request(app)
                .patch('/api/todos/invalid-id')
                .send({ title: 'Updated Title' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBeDefined();
        });
    });

    describe('Request Validation', () => {
        it('should handle invalid JSON in request body', async () => {
            const response = await request(app)
                .post('/api/todos')
                .set('Content-Type', 'application/json')
                .send('invalid json');

            expect(response.status).toBe(400);
        });

        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should handle invalid field types', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: 123, // Should be string
                    isCompleted: 'true' // Should be boolean
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Database Operation Errors', () => {
        it('should handle database save errors', async () => {
            // Mock Todo.save to simulate error
            jest.spyOn(Todo.prototype, 'save')
                .mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: 'Test Todo',
                    category: 'Test'
                });

            expect(response.status).toBe(500);
        });

        it('should handle database find errors', async () => {
            // Mock Todo.find to simulate error
            jest.spyOn(Todo, 'find')
                .mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app).get('/api/todos');
            expect(response.status).toBe(500);
        });
    });
});
