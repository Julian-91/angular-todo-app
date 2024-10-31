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
  newTodoCategory = '';
  selectedCategory = 'All';
  private subscription!: Subscription;
  predefinedCategories = ['Client work', 'Personal work', 'Personal', 'Cooking', 'Others'];

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
      const category = this.newTodoCategory.trim() || 'General';
      this.todoService.addTodo(this.newTodoTitle.trim(), category);
      this.newTodoTitle = '';
      this.newTodoCategory = '';
    }
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  toggleCompletion(id: number): void {
    this.todoService.toggleCompletion(id);
  }

  get categories(): string[] {
    const todoCategories = this.todos.map((todo) => todo.category);
    const allCategories = [...this.predefinedCategories, ...todoCategories]
    return Array.from(new Set(allCategories));
  }

  get filteredTodos(): Todo[] {
    if (this.selectedCategory === 'All') {
      return this.todos;
    } else {
      return this.todos.filter((todo) => todo.category === this.selectedCategory)
    }
  }

}
