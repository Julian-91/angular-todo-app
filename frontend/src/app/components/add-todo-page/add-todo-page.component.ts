import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-add-todo-page',
  standalone: true,
  imports: [CommonModule, TodoFormComponent],
  template: `
    <div class="add-todo-page-container">
      <div class="todo-card">
        <h2>Add Todo</h2>
        
        <!-- Success message -->
        <div *ngIf="showSuccessMessage" class="success-message">
          <div class="success-icon">✓</div>
          <div class="success-text">Todo added successfully!</div>
        </div>
        
        <app-todo-form
          [categories]="categories"
          [navigateToListAfterAdd]="false"
          (addTodoEvent)="handleAddTodo($event)">
        </app-todo-form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .add-todo-page-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .todo-card {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .success-message {
      display: flex;
      align-items: center;
      background-color: #ecfdf5;
      border: 1px solid #10b981;
      color: #047857;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1.25rem;
      animation: fadeInOut 5s forwards;
    }
    
    .success-icon {
      background-color: #10b981;
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      font-size: 12px;
      font-weight: bold;
    }
    
    .success-text {
      font-weight: 500;
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { opacity: 0; }
    }

    @media (max-width: 768px) {
      .add-todo-page-container {
        margin: 1rem auto;
      }
    }
  `]
})
export class AddTodoPageComponent implements OnInit, OnDestroy {
  categories: string[] = [];
  private predefinedCategories = ['Client work', 'Personal work', 'Personal', 'Cooking', 'Others'];
  private subscription: Subscription | null = null;
  showSuccessMessage = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.subscription = this.todoService.getTodos().subscribe(todos => {
      const todoCategories = todos.map(todo => todo.category);
      this.categories = Array.from(new Set([...this.predefinedCategories, ...todoCategories]));
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleAddTodo(todoData: { title: string; description: string; category: string }): void {
    this.todoService.addTodo(
      todoData.title,
      todoData.description,
      todoData.category
    );

    // Show success message
    this.showSuccessMessage = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }
} 