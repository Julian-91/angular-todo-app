import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  newTodoTitle = '';
  private subscription!: Subscription;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.subscription = this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  toggleCompletion(id: number): void {
    this.todoService.toggleCompletion(id);
  }

}
