import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TodoListComponent } from './todo-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';

// Mock data
const mockTodos: Todo[] = [
    {
        _id: '1',
        title: 'Complete project documentation',
        description: '',
        isCompleted: false,
        category: 'Work'
    },
    {
        _id: '2',
        title: 'Buy groceries',
        description: '',
        isCompleted: true,
        category: 'Shopping'
    },
    {
        _id: '3',
        title: 'Exercise',
        description: '',
        isCompleted: false,
        category: 'Health'
    }
];

// Mock TodoService
class MockTodoService {
    private todos$ = new BehaviorSubject<Todo[]>(mockTodos);

    getTodos(): Observable<Todo[]> {
        return this.todos$.asObservable();
    }

    addTodo(title: string, category: string): void {
        const newTodo: Todo = {
            _id: Date.now().toString(),
            title,
            description: '',
            isCompleted: false,
            category
        };
        const currentTodos = this.todos$.getValue();
        this.todos$.next([...currentTodos, newTodo]);
    }

    deleteTodo(id: string): void {
        const currentTodos = this.todos$.getValue();
        this.todos$.next(currentTodos.filter(todo => todo._id !== id));
    }

    toggleCompletion(id: string): void {
        const currentTodos = this.todos$.getValue();
        this.todos$.next(
            currentTodos.map(todo =>
                todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            )
        );
    }

    updateTodo(id: string, updates: Partial<Todo>): void {
        const currentTodos = this.todos$.getValue();
        this.todos$.next(
            currentTodos.map(todo =>
                todo._id === id ? { ...todo, ...updates } : todo
            )
        );
    }
}

const meta: Meta<TodoListComponent> = {
    title: 'Components/TodoList',
    component: TodoListComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, TodoItemComponent, TodoFormComponent],
            providers: [
                { provide: TodoService, useClass: MockTodoService }
            ],
        }),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    }
};

export default meta;
type Story = StoryObj<TodoListComponent>;

// Default state with some todos
export const Default: Story = {
    args: {}
};

// Empty state (no todos)
export const EmptyState: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: TodoService,
                    useValue: {
                        getTodos: () => new BehaviorSubject<Todo[]>([]),
                        addTodo: () => { },
                        deleteTodo: () => { },
                        toggleCompletion: () => { },
                        updateTodo: () => { }
                    }
                }
            ]
        })
    ]
};

// Many todos to test scrolling
export const ManyTodos: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: TodoService,
                    useValue: {
                        getTodos: () => new BehaviorSubject<Todo[]>(Array(20).fill(null).map((_, index) => ({
                            _id: index.toString(),
                            title: `Todo item ${index + 1}`,
                            description: '',
                            isCompleted: index % 3 === 0,
                            category: ['Work', 'Personal', 'Shopping', 'Health'][index % 4]
                        }))),
                        addTodo: () => { },
                        deleteTodo: () => { },
                        toggleCompletion: () => { },
                        updateTodo: () => { }
                    }
                }
            ]
        })
    ]
};

// Multiple categories
export const MultipleCategories: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: TodoService,
                    useValue: {
                        getTodos: () => new BehaviorSubject<Todo[]>([
                            {
                                _id: '1',
                                title: 'Work Task 1',
                                description: '',
                                isCompleted: false,
                                category: 'Work'
                            },
                            {
                                _id: '2',
                                title: 'Personal Task',
                                description: '',
                                isCompleted: true,
                                category: 'Personal'
                            },
                            {
                                _id: '3',
                                title: 'Shopping List',
                                description: '',
                                isCompleted: false,
                                category: 'Shopping'
                            },
                            {
                                _id: '4',
                                title: 'Work Task 2',
                                description: '',
                                isCompleted: true,
                                category: 'Work'
                            }
                        ]),
                        addTodo: () => { },
                        deleteTodo: () => { },
                        toggleCompletion: () => { },
                        updateTodo: () => { }
                    }
                }
            ]
        })
    ]
};

// All todos completed
export const AllCompleted: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: TodoService,
                    useValue: {
                        getTodos: () => new BehaviorSubject<Todo[]>([
                            {
                                _id: '1',
                                title: 'Completed Task 1',
                                description: '',
                                isCompleted: true,
                                category: 'Work'
                            },
                            {
                                _id: '2',
                                title: 'Completed Task 2',
                                description: '',
                                isCompleted: true,
                                category: 'Personal'
                            },
                            {
                                _id: '3',
                                title: 'Completed Task 3',
                                description: '',
                                isCompleted: true,
                                category: 'Shopping'
                            }
                        ]),
                        addTodo: () => { },
                        deleteTodo: () => { },
                        toggleCompletion: () => { },
                        updateTodo: () => { }
                    }
                }
            ]
        })
    ]
};