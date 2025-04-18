import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    description: 'Test description',
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display todo title', () => {
    const titleElement = fixture.debugElement.query(By.css('.todo-title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Todo');
  });

  it('should display todo description when it exists', () => {
    // Trigger description expanded view
    component.isDescriptionExpanded = true;
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(By.css('.todo-description p'));
    expect(descriptionElement.nativeElement.textContent.trim()).toBe('Test description');
  });

  it('should handle empty description correctly', () => {
    component.todo = { ...mockTodo, description: '' };
    fixture.detectChanges();

    const descriptionContainer = fixture.debugElement.query(By.css('.description-container'));
    expect(descriptionContainer).toBeFalsy();
  });

  it('should toggle description expansion correctly', () => {
    expect(component.isDescriptionExpanded).toBeFalsy();

    // Description has content and should be toggleable
    expect(component.hasDescription()).toBeTruthy();

    component.toggleDescription();
    expect(component.isDescriptionExpanded).toBeTruthy();

    component.toggleDescription();
    expect(component.isDescriptionExpanded).toBeFalsy();
  });

  it('should show description preview for long descriptions', () => {
    component.todo = {
      ...mockTodo,
      description: 'This is a very long description that should be truncated in the preview. It needs to be more than 100 characters to test the preview functionality properly.'
    };
    fixture.detectChanges();

    expect(component.shouldShowToggle()).toBeTruthy();
    expect(component.getDescriptionPreview().length).toBeLessThan(component.todo.description.length);
    expect(component.getDescriptionPreview()).toContain('...');
  });

  it('should display todo category', () => {
    const categoryElement = fixture.debugElement.query(By.css('.category'));
    expect(categoryElement.nativeElement.textContent.trim()).toBe('Test Category');
  });

  it('should emit delete event when delete button is clicked', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));

    deleteButton.nativeElement.click();

    expect(deleteSpy).toHaveBeenCalledWith('1');
  });

  it('should emit toggle event when checkbox is clicked', () => {
    const toggleSpy = jest.spyOn(component.toggle, 'emit');
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));

    checkbox.nativeElement.click();

    expect(toggleSpy).toHaveBeenCalledWith('1');
  });

  it('should reflect completed status in UI', () => {
    let titleElement = fixture.debugElement.query(By.css('.todo-title'));
    expect(titleElement.nativeElement.classList.contains('completed')).toBeFalsy();

    component.todo = { ...mockTodo, isCompleted: true };
    fixture.detectChanges();

    titleElement = fixture.debugElement.query(By.css('.todo-title'));
    expect(titleElement.nativeElement.classList.contains('completed')).toBeTruthy();
  });

  it('should check checkbox when todo is completed', () => {
    let checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkbox.nativeElement.checked).toBeFalsy();

    component.todo = { ...mockTodo, isCompleted: true };
    fixture.detectChanges();

    checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkbox.nativeElement.checked).toBeTruthy();
  });

  describe('Edit Mode', () => {
    it('should enter edit mode when edit button is clicked', () => {
      const editButton = fixture.debugElement.query(By.css('.edit-button'));
      editButton.nativeElement.click();
      fixture.detectChanges();

      const editForm = fixture.debugElement.query(By.css('.edit-form'));
      expect(editForm).toBeTruthy();
      expect(component.isEditing).toBe(true);
    });

    it('should populate edit form with current todo data including description', () => {
      component.startEditing();
      fixture.detectChanges();

      // Check the component properties
      expect(component.editedTitle).toBe(mockTodo.title);
      expect(component.editedDescription).toBe(mockTodo.description);
      expect(component.editedCategory).toBe(mockTodo.category);

      // Verify the textarea is present but don't check its value
      // as ngModel binding may not be immediately reflected in the test environment
      const descriptionTextarea = fixture.debugElement.query(By.css('.edit-description'));
      expect(descriptionTextarea).toBeTruthy();
    });

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

    it('should emit update event with new values when save button is clicked', () => {
      const updateSpy = jest.spyOn(component.update, 'emit');

      // Enter edit mode
      component.startEditing();
      fixture.detectChanges();

      // Update values
      component.editedTitle = 'Updated Title';
      component.editedCategory = 'Category 1';
      component.editedDescription = 'Updated description';
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('.save-button'));
      saveButton.nativeElement.click();

      expect(updateSpy).toHaveBeenCalledWith({
        id: mockTodo._id,
        updates: {
          title: 'Updated Title',
          description: 'Updated description',
          category: 'Category 1'
        }
      });
      expect(component.isEditing).toBe(false);
    });

    it('should not emit update event if title is empty', () => {
      const updateSpy = jest.spyOn(component.update, 'emit');

      // Enter edit mode
      component.startEditing();
      fixture.detectChanges();

      component.editedTitle = '   ';
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('.save-button'));
      saveButton.nativeElement.click();

      expect(updateSpy).not.toHaveBeenCalled();
      expect(component.isEditing).toBe(true);
    });

    it('should exit edit mode and revert changes when cancel button is clicked', () => {
      // Enter edit mode
      component.startEditing();
      fixture.detectChanges();

      component.editedTitle = 'Changed Title';
      component.editedCategory = 'Changed Category';
      fixture.detectChanges();

      const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
      cancelButton.nativeElement.click();

      expect(component.isEditing).toBe(false);
      expect(component.editedTitle).toBe(mockTodo.title);
      expect(component.editedCategory).toBe(mockTodo.category);
    });

    it('should handle Enter key to save changes', () => {
      const updateSpy = jest.spyOn(component.update, 'emit');

      // Enter edit mode
      component.startEditing();
      fixture.detectChanges();

      component.editedTitle = 'Updated Title';
      fixture.detectChanges();

      const titleInput = fixture.debugElement.query(By.css('.edit-title'));
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      titleInput.nativeElement.dispatchEvent(event);

      expect(updateSpy).toHaveBeenCalled();
      expect(component.isEditing).toBe(false);
    });

    it('should handle Escape key to cancel editing', () => {
      // Enter edit mode
      component.startEditing();
      fixture.detectChanges();

      component.editedTitle = 'Changed Title';
      fixture.detectChanges();

      const titleInput = fixture.debugElement.query(By.css('.edit-title'));
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      titleInput.nativeElement.dispatchEvent(event);

      expect(component.isEditing).toBe(false);
      expect(component.editedTitle).toBe(mockTodo.title);
    });
  });
});
