import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [TodoFormComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    component.categories = [
      { value: 'Work', label: 'Work' },
      { value: 'Personal', label: 'Personal' },
      { value: 'Shopping', label: 'Shopping' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display description textarea', () => {
    const descriptionArea = fixture.debugElement.query(By.css('textarea'));
    expect(descriptionArea).toBeTruthy();
    expect(descriptionArea.nativeElement.placeholder).toContain('Add details about this task');
  });

  it('should display category options', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));
    const options = selectElement.nativeElement.querySelectorAll('option');

    // Select Category + 3 categories
    expect(options.length).toBe(4);
    expect(options[0].textContent.trim()).toBe('Select a category');
    expect(options[1].textContent.trim()).toBe('Work');
    expect(options[2].textContent.trim()).toBe('Personal');
    expect(options[3].textContent.trim()).toBe('Shopping');
  });

  it('should emit event with todo data including description when form is submitted', () => {
    const addTodoSpy = jest.spyOn(component.addTodoEvent, 'emit');

    component.title = 'Test Todo';
    component.description = 'Test Description';
    component.selectedCategory = 'Work';

    const addButton = fixture.debugElement.query(By.css('.add-button'));
    addButton.nativeElement.click();

    expect(addTodoSpy).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
      category: 'Work'
    });

    // Form should be reset
    expect(component.title).toBe('');
    expect(component.description).toBe('');
    expect(component.selectedCategory).toBe(null);
  });

  it('should reset description when form is submitted', () => {
    component.title = 'Test Todo';
    component.description = 'Test Description';
    component.selectedCategory = 'Work';

    component.addTodo();

    expect(component.description).toBe('');
  });

  it('should support empty description', () => {
    const addTodoSpy = jest.spyOn(component.addTodoEvent, 'emit');

    component.title = 'Test Todo';
    component.description = '';
    component.selectedCategory = 'Work';

    component.addTodo();

    expect(addTodoSpy).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: '',
      category: 'Work'
    });
  });

  it('should not emit event when title is empty', () => {
    const addTodoSpy = jest.spyOn(component.addTodoEvent, 'emit');

    component.title = '';
    component.description = 'Test Description';
    component.selectedCategory = 'Work';

    component.addTodo();

    expect(addTodoSpy).not.toHaveBeenCalled();
  });

  it('should use "General" category when no category is selected', () => {
    const addTodoSpy = jest.spyOn(component.addTodoEvent, 'emit');

    component.title = 'Test Todo';
    component.description = 'Test Description';
    component.selectedCategory = null;

    component.addTodo();

    expect(addTodoSpy).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
      category: 'General'
    });
  });

  describe('Navigation Behavior', () => {
    it('should navigate to home when navigateToListAfterAdd is true', () => {
      component.navigateToListAfterAdd = true;
      component.title = 'Test Todo';

      component.addTodo();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should not navigate when navigateToListAfterAdd is false', () => {
      component.navigateToListAfterAdd = false;
      component.title = 'Test Todo';

      component.addTodo();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when form is invalid', () => {
      component.navigateToListAfterAdd = true;
      component.title = '';

      component.addTodo();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
