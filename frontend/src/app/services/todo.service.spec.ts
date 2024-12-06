import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { TodoApiService } from './todo-api.service';
import { of } from 'rxjs';
import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let apiService: jest.Mocked<TodoApiService>;

  const mockTodos: Todo[] = [
    { _id: '1', title: 'Test Todo 1', isCompleted: false, category: 'General' },
    { _id: '2', title: 'Test Todo 2', isCompleted: true, category: 'Work' }
  ];

  beforeEach(() => {
    const apiServiceMock = {
      getTodos: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      updateTodo: jest.fn(),
    };

    // Setup default mock implementations
    apiServiceMock.getTodos.mockReturnValue(of(mockTodos));
    apiServiceMock.addTodo.mockReturnValue(of(mockTodos[0]));
    apiServiceMock.deleteTodo.mockReturnValue(of(undefined));
    apiServiceMock.updateTodo.mockReturnValue(of(mockTodos[0]));

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: TodoApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(TodoService);
    apiService = TestBed.inject(TodoApiService) as jest.Mocked<TodoApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load todos on initialization', (done) => {
    apiService.getTodos.mockReturnValue(of(mockTodos));

    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
      expect(apiService.getTodos).toHaveBeenCalled();
      done();
    });
  });

  describe('addTodo', () => {
    it('should add a new todo and update the todos list', () => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        isCompleted: false,
        category: 'General'
      };
      apiService.addTodo.mockReturnValue(of(newTodo));

      service.addTodo('New Todo');

      expect(apiService.addTodo).toHaveBeenCalledWith({
        title: 'New Todo',
        category: 'General'
      });

      service.getTodos().subscribe(todos => {
        expect(todos).toContainEqual(newTodo);
      });
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo from the list', () => {
      service['todosSubject'].next(mockTodos);

      service.deleteTodo('1');

      expect(apiService.deleteTodo).toHaveBeenCalledWith('1');

      service.getTodos().subscribe(todos => {
        expect(todos.length).toBe(1);
        expect(todos.find(t => t._id === '1')).toBeUndefined();
      });
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle todo completion status', () => {
      service['todosSubject'].next(mockTodos);

      const updatedTodo: Todo = {
        ...mockTodos[0],
        isCompleted: true
      };
      apiService.updateTodo.mockReturnValue(of(updatedTodo));

      service.toggleCompletion('1');

      expect(apiService.updateTodo).toHaveBeenCalledWith('1', { isCompleted: true });

      service.getTodos().subscribe(todos => {
        const todo = todos.find(t => t._id === '1');
        expect(todo?.isCompleted).toBe(true);
      });
    });
  });
});