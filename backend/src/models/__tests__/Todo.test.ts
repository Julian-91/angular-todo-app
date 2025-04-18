import mongoose from 'mongoose';
import Todo, { ITodo } from '../Todo';

interface MongooseError extends Error {
  errors: {
    [key: string]: mongoose.Error.ValidatorError;
  };
}

describe('Todo Model Test', () => {
  describe('Validation Tests', () => {
    it('should validate a valid todo', async () => {
      const validTodo = {
        title: 'Test Todo',
        isCompleted: false,
        category: 'Work'
      };
      const todo = new Todo(validTodo);
      const savedTodo = await todo.save();

      expect(savedTodo._id).toBeDefined();
      expect(savedTodo.title).toBe(validTodo.title);
      expect(savedTodo.isCompleted).toBe(validTodo.isCompleted);
      expect(savedTodo.category).toBe(validTodo.category);
      expect(savedTodo.description).toBe('');
    });

    it('should use default values when not provided', async () => {
      const todoWithoutOptionals = {
        title: 'Test Todo'
      };
      const todo = new Todo(todoWithoutOptionals);
      const savedTodo = await todo.save();

      expect(savedTodo.isCompleted).toBe(false);
      expect(savedTodo.category).toBe('General');
      expect(savedTodo.description).toBe('');
    });

    it('should store description correctly when provided', async () => {
      const todoWithDescription = {
        title: 'Test Todo',
        description: 'This is a test description',
        isCompleted: false,
        category: 'Work'
      };
      const todo = new Todo(todoWithDescription);
      const savedTodo = await todo.save();

      expect(savedTodo.description).toBe(todoWithDescription.description);
    });

    it('should update description correctly', async () => {
      const todo = new Todo({
        title: 'Original Title'
      });
      const savedTodo = await todo.save();
      expect(savedTodo.description).toBe('');

      savedTodo.description = 'Updated description';
      const updatedTodo = await savedTodo.save();
      expect(updatedTodo.description).toBe('Updated description');
    });

    it('should fail validation when title is empty', async () => {
      const todoWithoutTitle = {
        isCompleted: false,
        category: 'Work'
      };

      let err: MongooseError | null = null;
      try {
        const todo = new Todo(todoWithoutTitle);
        await todo.save();
      } catch (error) {
        err = error as MongooseError;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err?.errors.title).toBeDefined();
    });

    it('should fail validation when title is null', async () => {
      const todoWithNullTitle = {
        title: null,
        isCompleted: false,
        category: 'Work'
      };

      let err: MongooseError | null = null;
      try {
        const todo = new Todo(todoWithNullTitle);
        await todo.save();
      } catch (error) {
        err = error as MongooseError;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err?.errors.title).toBeDefined();
    });

    it('should convert string boolean values for isCompleted', async () => {
      const todo = new Todo({
        title: 'Test Todo',
        isCompleted: 'true',
        category: 'Work'
      });
      const savedTodo = await todo.save();

      expect(typeof savedTodo.isCompleted).toBe('boolean');
      expect(savedTodo.isCompleted).toBe(true);
    });

    it('should successfully update existing todo', async () => {
      const todo = new Todo({
        title: 'Original Title',
        category: 'Personal'
      });
      const savedTodo = await todo.save();

      savedTodo.title = 'Updated Title';
      savedTodo.category = 'Work';
      const updatedTodo = await savedTodo.save();

      expect(updatedTodo.title).toBe('Updated Title');
      expect(updatedTodo.category).toBe('Work');
    });

    it('should handle empty category and use default', async () => {
      const todoWithEmptyCategory = {
        title: 'Test Todo',
        category: ''
      };
      const todo = new Todo(todoWithEmptyCategory);
      const savedTodo = await todo.save();

      expect(savedTodo.category).toBe('General');
    });
  });
});
