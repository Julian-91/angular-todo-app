import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';

interface CategoryOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-add-todo-page',
  standalone: true,
  imports: [CommonModule, TodoFormComponent],
  template: `
    <div class="page-container">
      <h2 class="page-title">Add Todo</h2>
      <app-todo-form
        [categories]="categoryOptions"
        [navigateToListAfterAdd]="false"
        (addTodoEvent)="handleAddTodo($event)">
      </app-todo-form>
      
      <!-- Success message -->
      <div *ngIf="showSuccessMessage" class="success-message">
        <div class="success-icon">✓</div>
        <div class="success-text">Todo added successfully!</div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      font-family: system-ui, -apple-system, sans-serif;
      display: block;
    }
    
    .page-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }
    
    .page-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1e293b;
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: left;
      padding-left: 0;
      letter-spacing: -0.5px;
      border-bottom: 0 !important;
    }
    
    .success-message {
      display: flex;
      align-items: center;
      background-color: #ecfdf5;
      border: 1px solid #10b981;
      color: #047857;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin: 1rem auto;
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
      .page-title {
        font-size: 1.75rem;
        margin: 1.5rem 0 1rem;
      }
    }

    @media (max-width: 480px) {
      .page-container {
        padding: 0 1rem;
      }
      
      .page-title {
        font-size: 1.5rem;
        margin: 1rem 0 0.75rem;
      }
    }
  `]
})
export class AddTodoPageComponent implements OnInit, OnDestroy {
  categoryOptions: CategoryOption[] = [];
  private predefinedCategories: string[] = [
    'Client work',
    'Personal work',
    'Personal',
    'Cooking',
    'Work',
    'Shopping',
    'Health',
    'Others'
  ];
  private subscription: Subscription | null = null;
  showSuccessMessage = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.subscription = this.todoService.getTodos().subscribe(todos => {
      // Get unique categories from existing todos
      const todoCategories = todos.map(todo => todo.category);
      const uniqueCategories = Array.from(new Set([...this.predefinedCategories, ...todoCategories]));

      // Map to category options format
      this.categoryOptions = uniqueCategories.map(category => ({
        value: category,
        label: category
      }));
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