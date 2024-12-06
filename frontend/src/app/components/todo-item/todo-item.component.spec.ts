import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';
import { By } from '@angular/platform-browser';

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
      imports: [TodoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display todo title', () => {
    const titleElement = fixture.debugElement.query(By.css('.todo-title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Todo');
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
    // Initially not completed
    let titleElement = fixture.debugElement.query(By.css('.todo-title'));
    expect(titleElement.nativeElement.classList.contains('completed')).toBeFalsy();

    // Change to completed
    component.todo = { ...mockTodo, isCompleted: true };
    fixture.detectChanges();

    titleElement = fixture.debugElement.query(By.css('.todo-title'));
    expect(titleElement.nativeElement.classList.contains('completed')).toBeTruthy();
  });

  it('should check checkbox when todo is completed', () => {
    // Initially not completed
    let checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkbox.nativeElement.checked).toBeFalsy();

    // Change to completed
    component.todo = { ...mockTodo, isCompleted: true };
    fixture.detectChanges();

    checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkbox.nativeElement.checked).toBeTruthy();
  });

  it('should have correct ID for checkbox and label', () => {
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    const label = fixture.debugElement.query(By.css('.todo-title'));
    
    expect(checkbox.nativeElement.id).toBe('todo-checkbox-1');
    expect(label.nativeElement.getAttribute('for')).toBe('todo-checkbox-1');
  });
});
