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
    { _id: '1', title: 'Test Todo 1', isCompleted: false, category: 'Work' },
    { _id: '2', title: 'Test Todo 2', isCompleted: true, category: 'Personal' }
  ];

  beforeEach(async () => {
    const todoServiceMock = {
      getTodos: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      toggleCompletion: jest.fn()
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

  describe('Adding todos', () => {
    it('should add todo when title is not empty', () => {
      component.newTodoTitle = '  New Todo  ';
      component.newTodoCategory = 'Work';

      component.addTodo();

      expect(todoService.addTodo).toHaveBeenCalledWith('New Todo', 'Work');
      expect(component.newTodoTitle).toBe('');
      expect(component.newTodoCategory).toBe('');
    });

    it('should not add todo when title is empty or only whitespace', () => {
      component.newTodoTitle = '   ';
      component.addTodo();

      expect(todoService.addTodo).not.toHaveBeenCalled();
    });

    it('should use "General" category when no category is specified', () => {
      component.newTodoTitle = 'New Todo';
      component.newTodoCategory = '';

      component.addTodo();

      expect(todoService.addTodo).toHaveBeenCalledWith('New Todo', 'General');
    });

    it('should add todo on enter key press', () => {
      component.newTodoTitle = 'New Todo';

      const input = fixture.debugElement.query(By.css('input[type="text"]'));
      const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
      input.nativeElement.dispatchEvent(enterEvent);

      expect(todoService.addTodo).toHaveBeenCalled();
    });
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

  describe('Categories management', () => {
    it('should combine predefined and todo categories without duplicates', () => {
      const categories = component.categories;
      const expectedCategories = [
        ...component.predefinedCategories,
        'Work',
        'Personal'
      ];

      expect(categories).toEqual(expect.arrayContaining(expectedCategories));
      // Check for no duplicates
      expect(new Set(categories).size).toBe(categories.length);
    });

    it('should include category in dropdown after adding todo with new category', () => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        isCompleted: false,
        category: 'NewCategory'
      };
      component.todos = [...mockTodos, newTodo];
      fixture.detectChanges();

      expect(component.categories).toContain('NewCategory');
    });
  });

  describe('Component cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const unsubscribeSpy = jest.spyOn(component['subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Todo item integration', () => {
    it('should render todo-item components', () => {
      const todoItems = fixture.debugElement.queryAll(By.directive(TodoItemComponent));
      expect(todoItems.length).toBe(mockTodos.length);
    });

    it('should pass correct props to todo-item components', () => {
      const firstTodoItem = fixture.debugElement.query(By.directive(TodoItemComponent));
      const todoItemComponent = firstTodoItem.componentInstance;

      expect(todoItemComponent.todo).toEqual(mockTodos[0]);
    });
  });
});