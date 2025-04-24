import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Todo } from '../../models/todo.model';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jest.Mocked<TodoService>;

  const mockTodos: Todo[] = [
    { _id: '1', title: 'Test Todo 1', description: '', isCompleted: false, category: 'Work' },
    { _id: '2', title: 'Test Todo 2', description: '', isCompleted: true, category: 'Personal' }
  ];

  beforeEach(async () => {
    const todoServiceMock = {
      getTodos: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      toggleCompletion: jest.fn(),
      updateTodo: jest.fn()
    };

    todoServiceMock.getTodos.mockReturnValue(of(mockTodos));

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TodoListComponent,
        TodoItemComponent
      ],
      providers: [
        { provide: TodoService, useValue: todoServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jest.Mocked<TodoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    expect(todoService.getTodos).toHaveBeenCalled();
    expect(component.todos).toEqual(mockTodos);
  });

  describe('Todo actions', () => {
    it('should delete todo', () => {
      component.deleteTodo('1');
      expect(todoService.deleteTodo).toHaveBeenCalledWith('1');
    });

    it('should toggle todo completion', () => {
      component.toggleCompletion('1');
      expect(todoService.toggleCompletion).toHaveBeenCalledWith('1');
    });

    it('should update todo', () => {
      component.updateTodo({
        id: '1',
        updates: {
          title: 'Updated Title',
          description: 'Updated Description',
          category: 'Updated Category'
        }
      });

      expect(todoService.updateTodo).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        description: 'Updated Description',
        category: 'Updated Category'
      });
    });
  });

  describe('Category filtering', () => {
    it('should show all todos when "All" category is selected', () => {
      component.selectedCategory = 'All';
      expect(component.filteredTodos).toEqual(mockTodos);
    });

    it('should filter todos by selected category', () => {
      component.selectedCategory = 'Work';
      expect(component.filteredTodos).toEqual([mockTodos[0]]);
    });

    it('should show empty state when no todos match category', () => {
      component.selectedCategory = 'NonExistent';
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('.empty-state'));
      expect(emptyState).toBeTruthy();
    });
  });

  describe('Color handling', () => {
    it('should generate colors for categories', () => {
      const color = component.getCategoryColor('Work');
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    it('should generate text colors based on background color', () => {
      const textColor = component.getCategoryTextColor('Work');
      expect(textColor).toBeDefined();
      expect(typeof textColor).toBe('string');
      expect(['#333333', '#ffffff'].includes(textColor)).toBeTruthy();
    });

    it('should use predefined color if available', () => {
      // Categories are defined in the component
      const color = component.getCategoryColor('General');
      expect(color).toBe('#74b9ff');
    });
  });

  describe('Category listing', () => {
    it('should combine predefined categories with todo categories', () => {
      const categories = component.categories;

      // Should include predefined categories
      expect(categories).toContain('Personal');

      // Should include categories from todos
      expect(categories).toContain('Work');

      // Should not have duplicates
      expect(categories.length).toBe(new Set(categories).size);
    });
  });
});