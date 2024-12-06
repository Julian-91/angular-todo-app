import request from 'supertest';
import express from 'express';
import todoRoutes from '../../routes/todos';
import Todo from '../../models/Todo';

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

describe('Todo Integration Tests', () => {
    it('should perform complete CRUD flow', async () => {
        // CREATE
        const createResponse = await request(app)
            .post('/api/todos')
            .send({
                title: 'Integration Test Todo',
                category: 'Test'
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.title).toBe('Integration Test Todo');
        const todoId = createResponse.body._id;

        // READ
        const readResponse = await request(app)
            .get('/api/todos');

        expect(readResponse.status).toBe(200);
        expect(readResponse.body.some(todo => todo._id === todoId)).toBe(true);

        // UPDATE
        const updateResponse = await request(app)
            .patch(`/api/todos/${todoId}`)
            .send({
                title: 'Updated Integration Test Todo',
                isCompleted: true
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toBe('Updated Integration Test Todo');
        expect(updateResponse.body.isCompleted).toBe(true);

        // DELETE
        const deleteResponse = await request(app)
            .delete(`/api/todos/${todoId}`);

        expect(deleteResponse.status).toBe(200);

        // Verify deletion
        const verifyResponse = await request(app)
            .get('/api/todos');

        expect(verifyResponse.body.some(todo => todo._id === todoId)).toBe(false);
    });

    it('should handle concurrent operations correctly', async () => {
        // Create multiple todos simultaneously
        const createPromises = Array(5).fill(null).map((_, index) => {
            return request(app)
                .post('/api/todos')
                .send({
                    title: `Concurrent Todo ${index}`,
                    category: 'Test'
                });
        });

        const createResponses = await Promise.all(createPromises);
        const todoIds = createResponses.map(response => response.body._id);

        // Verify all todos were created
        expect(createResponses.every(response => response.status === 201)).toBe(true);

        // Update all todos concurrently
        const updatePromises = todoIds.map((id, index) => {
            return request(app)
                .patch(`/api/todos/${id}`)
                .send({
                    title: `Updated Concurrent Todo ${index}`,
                    isCompleted: true
                });
        });

        const updateResponses = await Promise.all(updatePromises);
        expect(updateResponses.every(response => response.status === 200)).toBe(true);

        // Delete all todos concurrently
        const deletePromises = todoIds.map(id => {
            return request(app)
                .delete(`/api/todos/${id}`);
        });

        const deleteResponses = await Promise.all(deletePromises);
        expect(deleteResponses.every(response => response.status === 200)).toBe(true);
    });
});
