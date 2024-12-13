import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  const mockTodo: Todo = {
    _id: '1',
    title: 'Test Todo',
    isCompleted: false,
    category: 'Test Category'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    component.availableCategories = ['Category 1', 'Category 2'];
    fixture.detectChanges();
  });

  // ... other tests remain the same ...

  describe('Edit Mode', () => {
    it('should populate edit form with current todo data', () => {
      // Directly set edit mode and values
      component.startEditing();
      fixture.detectChanges();

      // Check component properties first
      expect(component.editedTitle).toBe(mockTodo.title);
      expect(component.editedCategory).toBe(mockTodo.category);

      // Then check the DOM elements
      const titleInput: HTMLInputElement = fixture.debugElement.query(By.css('.edit-title')).nativeElement;
      const categorySelect: HTMLSelectElement = fixture.debugElement.query(By.css('.edit-category')).nativeElement;

      expect(titleInput.value).toBe(mockTodo.title);
      expect(categorySelect.value).toBe(mockTodo.category);
    });

    // ... other tests remain the same ...
  });
});
