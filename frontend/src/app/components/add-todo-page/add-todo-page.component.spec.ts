import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddTodoPageComponent } from './add-todo-page.component';
import { TodoService } from '../../services/todo.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { Router } from '@angular/router';

describe('AddTodoPageComponent', () => {
    let component: AddTodoPageComponent;
    let fixture: ComponentFixture<AddTodoPageComponent>;
    let todoService: jest.Mocked<TodoService>;
    let router: jest.Mocked<Router>;

    const mockTodos: Todo[] = [
        { _id: '1', title: 'Test Todo 1', description: '', isCompleted: false, category: 'Work' },
        { _id: '2', title: 'Test Todo 2', description: '', isCompleted: true, category: 'Personal' }
    ];

    beforeEach(async () => {
        const todoServiceMock = {
            getTodos: jest.fn().mockReturnValue(of(mockTodos)),
            addTodo: jest.fn()
        };

        const routerMock = {
            navigate: jest.fn()
        };

        await TestBed.configureTestingModule({
            imports: [
                AddTodoPageComponent,
                TodoFormComponent,
                FormsModule
            ],
            providers: [
                { provide: TodoService, useValue: todoServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddTodoPageComponent);
        component = fixture.componentInstance;
        todoService = TestBed.inject(TodoService) as jest.Mocked<TodoService>;
        router = TestBed.inject(Router) as jest.Mocked<Router>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch categories from TodoService on init', () => {
        expect(todoService.getTodos).toHaveBeenCalled();

        // Mock predefined categories in component + categories from todos
        expect(component.categories).toContain('Work');
        expect(component.categories).toContain('Personal');
        expect(component.categories).toContain('Personal work');
    });

    it('should render todo form component', () => {
        const todoForm = fixture.debugElement.query(By.directive(TodoFormComponent));
        expect(todoForm).toBeTruthy();
    });

    it('should pass categories to todo form', () => {
        const todoForm = fixture.debugElement.query(By.directive(TodoFormComponent));
        const todoFormComponent = todoForm.componentInstance;

        expect(todoFormComponent.categories).toEqual(component.categories);
    });

    it('should set navigateToListAfterAdd to false on todo form', () => {
        const todoForm = fixture.debugElement.query(By.directive(TodoFormComponent));
        const todoFormComponent = todoForm.componentInstance;

        expect(todoFormComponent.navigateToListAfterAdd).toBe(false);
    });

    it('should handle add todo event from form', () => {
        const todoData = {
            title: 'New Todo',
            description: 'Test description',
            category: 'Work'
        };

        component.handleAddTodo(todoData);

        expect(todoService.addTodo).toHaveBeenCalledWith(
            'New Todo',
            'Test description',
            'Work'
        );
    });

    it('should not display success message initially', () => {
        const successMessage = fixture.debugElement.query(By.css('.success-message'));
        expect(successMessage).toBeFalsy();
    });

    it('should display success message after adding todo', () => {
        component.handleAddTodo({
            title: 'New Todo',
            description: 'Test description',
            category: 'Work'
        });

        fixture.detectChanges();

        const successMessage = fixture.debugElement.query(By.css('.success-message'));
        expect(successMessage).toBeTruthy();
        expect(successMessage.nativeElement.textContent).toContain('Todo added successfully');
    });

    it('should hide success message after 5 seconds', fakeAsync(() => {
        component.handleAddTodo({
            title: 'New Todo',
            description: 'Test description',
            category: 'Work'
        });

        fixture.detectChanges();
        expect(component.showSuccessMessage).toBe(true);

        // Fast-forward time
        tick(5000);

        expect(component.showSuccessMessage).toBe(false);
    }));

    it('should unsubscribe on destroy', () => {
        const subscription = component['subscription'];
        if (subscription) {
            const unsubscribeSpy = jest.spyOn(subscription, 'unsubscribe');

            component.ngOnDestroy();

            expect(unsubscribeSpy).toHaveBeenCalled();
        }
    });
}); 