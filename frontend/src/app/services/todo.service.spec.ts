import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { TodoApiService } from './todo-api.service';
import { of } from 'rxjs';
import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let apiServiceSpy: jasmine.SpyObj<TodoApiService>;
  
  const mockTodos: Todo[] = [
    { _id: '1', title: 'Test Todo 1', isCompleted: false, category: 'General' },
    { _id: '2', title: 'Test Todo 2', isCompleted: true, category: 'Work' }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TodoApiService', ['getTodos', 'addTodo', 'deleteTodo', 'updateTodo']);
    // Setup default return values for spy methods
    spy.getTodos.and.returnValue(of(mockTodos));
    spy.addTodo.and.returnValue(of(mockTodos[0]));
    spy.deleteTodo.and.returnValue(of(void 0));
    spy.updateTodo.and.returnValue(of(mockTodos[0]));

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: TodoApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(TodoService);
    apiServiceSpy = TestBed.inject(TodoApiService) as jasmine.SpyObj<TodoApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load todos on initialization', (done) => {
    apiServiceSpy.getTodos.and.returnValue(of(mockTodos));

    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
      expect(apiServiceSpy.getTodos).toHaveBeenCalled();
      done();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo and update the todos list', fakeAsync(() => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        isCompleted: false,
        category: 'General'
      };
      apiServiceSpy.addTodo.and.returnValue(of(newTodo));

      // Add the new todo
      service.addTodo('New Todo');
      tick();

      // Verify the result
      service.getTodos().subscribe(todos => {
        expect(todos).toContain(newTodo);
        expect(apiServiceSpy.addTodo).toHaveBeenCalledWith({
          title: 'New Todo',
          category: 'General'
        });
      });
    }));

    it('should use custom category when provided', fakeAsync(() => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        isCompleted: false,
        category: 'Work'
      };
      apiServiceSpy.addTodo.and.returnValue(of(newTodo));

      service.addTodo('New Todo', 'Work');
      tick();

      expect(apiServiceSpy.addTodo).toHaveBeenCalledWith({
        title: 'New Todo',
        category: 'Work'
      });
    }));
  });

  describe('deleteTodo', () => {
    it('should remove todo from the list', fakeAsync(() => {
      // Setup initial state
      service['todosSubject'].next(mockTodos);
      
      // Delete a todo
      service.deleteTodo('1');
      tick();

      // Verify the result
      service.getTodos().subscribe(todos => {
        expect(todos.length).toBe(1);
        expect(todos.find(t => t._id === '1')).toBeUndefined();
        expect(apiServiceSpy.deleteTodo).toHaveBeenCalledWith('1');
      });
    }));
  });

  describe('toggleCompletion', () => {
    it('should toggle todo completion status', fakeAsync(() => {
      // Setup initial state
      service['todosSubject'].next(mockTodos);
      
      const updatedTodo: Todo = {
        ...mockTodos[0],
        isCompleted: true
      };
      apiServiceSpy.updateTodo.and.returnValue(of(updatedTodo));

      // Toggle completion
      service.toggleCompletion('1');
      tick();

      // Verify the result
      service.getTodos().subscribe(todos => {
        const todo = todos.find(t => t._id === '1');
        expect(todo?.isCompleted).toBe(true);
        expect(apiServiceSpy.updateTodo).toHaveBeenCalledWith('1', { isCompleted: true });
      });
    }));

    it('should not make API call if todo is not found', fakeAsync(() => {
      // Setup initial state
      service['todosSubject'].next(mockTodos);
      
      // Try to toggle non-existent todo
      service.toggleCompletion('999');
      tick();

      expect(apiServiceSpy.updateTodo).not.toHaveBeenCalled();
    }));
  });

  describe('error handling', () => {
    it('should maintain current state if API call fails', fakeAsync(() => {
      // Setup initial state with mock todos
      service['todosSubject'].next(mockTodos);
      
      // Setup API to fail
      apiServiceSpy.deleteTodo.and.returnValue(of(new Error('API Error')));

      // Attempt to delete
      service.deleteTodo('1');
      tick();

      // Verify state remains unchanged
      service.getTodos().subscribe(todos => {
        expect(todos).toEqual(mockTodos);
        expect(todos.length).toBe(2);
      });
    }));
  });
});