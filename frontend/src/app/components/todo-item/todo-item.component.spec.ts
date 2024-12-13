import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('TodoItemComponent', () => {
  // ... previous tests remain the same ...

  describe('Edit Mode', () => {
    // ... other edit mode tests remain the same ...

    it('should include all unique categories in dropdown', () => {
      component.startEditing();
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('.edit-category option'));
      const categories = options.map(option => option.nativeElement.text.trim());

      expect(categories).toContain('General');
      expect(categories).toContain('Category 1');
      expect(categories).toContain('Category 2');
      expect(categories).toContain(mockTodo.category);
      expect(new Set(categories).size).toBe(categories.length); // No duplicates
    });

    // ... other edit mode tests remain the same ...
  });
});
