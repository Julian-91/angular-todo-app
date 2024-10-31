import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private storageKey = 'todos';
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>(this.todos);
  private nextId = 1;

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    const todosJson = localStorage.getItem(this.storageKey);
    if (todosJson) {
      try {
        this.todos = JSON.parse(todosJson).map((todo: any) => ({
          ...todo,
          category: todo.category || 'General',
        }));
        // Update nextId based on existing todos
        if (this.todos.length > 0) {
          this.nextId = Math.max(...this.todos.map((todo) => todo.id)) + 1;
        }
        this.todosSubject.next(this.todos);
      } catch (error) {
        console.error('Error parsing todos from localStorage', error);
        this.todos = [];
        this.nextId = 1;
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  private saveTodos(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  getTodos() {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string, category: string = 'General'): void {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      isCompleted: false,
      category,
    };
    this.todos.push(newTodo);
    this.todosSubject.next(this.todos);
    this.saveTodos();
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todosSubject.next(this.todos);
    this.saveTodos();
  }

  toggleCompletion(id: number): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      this.todosSubject.next(this.todos);
      this.saveTodos();
    }
  }
}
