import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Todo, { ITodo } from '../../models/Todo';
import '../../test/setup';

// Define interface for API response
interface TodoResponse {
    _id: string;
    title: string;
    isCompleted: boolean;
    category: string;
}

describe('Todo API Integration Tests', () => {
    let todoId: string;

    beforeEach(async () => {
        const todo: ITodo = await Todo.create({
            title: 'Test Todo',
            isCompleted: false,
            category: 'Test'
        }) as ITodo;

        todoId = todo._id.toString();
    });

    describe('PATCH /api/todos/:id', () => {
        it('should update a todo successfully', async () => {
            const response = await request(app)
                .patch(`/api/todos/${todoId}`)
                .send({
                    title: 'Updated Title',
                    isCompleted: true,
                    category: 'Work'
                });

            const todo: TodoResponse = response.body;

            expect(response.status).toBe(200);
            expect(todo.title).toBe('Updated Title');
            expect(todo.isCompleted).toBe(true);
            expect(todo.category).toBe('Work');
        });

        // Add more integration tests as needed
    });
});
