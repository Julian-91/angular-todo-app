import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { TodoApiService } from './todo-api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor(private apiService: TodoApiService) {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.apiService.getTodos().subscribe((todos) => {
      this.todosSubject.next(todos);
    });
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string, category: string = 'General'): void {
    const todoData = { title, category };
    this.apiService.addTodo(todoData).subscribe((newTodo) => {
      const currentTodos = this.todosSubject.value;
      this.todosSubject.next([...currentTodos, newTodo]);
    });
  }

  deleteTodo(id: string): void {
    this.apiService.deleteTodo(id).subscribe(() => {
      const updatedTodos = this.todosSubject.value.filter((t) => t._id !== id);
      this.todosSubject.next(updatedTodos);
    });
  }

  toggleCompletion(id: string): void {
    const todo = this.todosSubject.value.find((t) => t._id === id);
    if (todo) {
      this.apiService
        .updateTodo(id, { isCompleted: !todo.isCompleted })
        .subscribe((updatedTodo) => {
          const todos = this.todosSubject.value.map((t) =>
            t._id === id ? updatedTodo : t
          );
          this.todosSubject.next(todos);
        });
    }
  }
}
