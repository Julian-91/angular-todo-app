import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from '../../routes/todos';
import Todo from '../../models/Todo';
import '../setup';

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

describe('Error Handling Tests', () => {
    describe('Database Operation Errors', () => {
        it('should handle database find errors', async () => {
            // Mock Todo.find to simulate error
            const mockFind = jest.spyOn(Todo, 'find')
                .mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app).get('/api/todos');
            expect(response.status).toBe(500);

            // Restore the original implementation
            mockFind.mockRestore();
        });

        it('should handle database save errors', async () => {
            // Mock Todo.create to simulate error
            const mockSave = jest.spyOn(Todo.prototype, 'save')
                .mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: 'Test Todo',
                    category: 'Test'
                });

            expect(response.status).toBe(500);

            // Restore the original implementation
            mockSave.mockRestore();
        });

        it('should handle database delete errors', async () => {
            const validObjectId = new mongoose.Types.ObjectId();
            const mockDelete = jest.spyOn(Todo, 'findByIdAndDelete')
                .mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .delete(`/api/todos/${validObjectId}`);

            expect(response.status).toBe(500);

            // Restore the original implementation
            mockDelete.mockRestore();
        });
    });

    describe('Invalid ObjectId Handling', () => {
        it('should handle invalid ObjectId in delete request', async () => {
            const response = await request(app)
                .delete('/api/todos/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid todo ID format');
        });

        it('should handle invalid ObjectId in update request', async () => {
            const response = await request(app)
                .patch('/api/todos/invalid-id')
                .send({ title: 'Updated Title' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid todo ID format');
        });
    });

    describe('Request Validation', () => {
        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Title is required');
        });

        it('should handle empty title', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: ''
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Title is required');
        });

        it('should handle whitespace-only title', async () => {
            const response = await request(app)
                .post('/api/todos')
                .send({
                    title: '   '
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Title is required');
        });
    });
});
