import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
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
        TodoItemComponent,
        TodoFormComponent
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
    it('should handle adding todo from form component', () => {
      component.handleAddTodo({
        title: 'New Todo',
        description: '',
        category: 'Work'
      });

      expect(todoService.addTodo).toHaveBeenCalledWith(
        'New Todo',
        '',
        'Work'
      );
    });

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
        description: '',
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

  describe('Todo form integration', () => {
    it('should render todo-form component', () => {
      const todoForm = fixture.debugElement.query(By.directive(TodoFormComponent));
      expect(todoForm).toBeTruthy();
    });

    it('should pass categories to todo-form component', () => {
      const todoForm = fixture.debugElement.query(By.directive(TodoFormComponent));
      const todoFormComponent = todoForm.componentInstance;

      expect(todoFormComponent.categories).toEqual(component.categories);
    });
  });
});