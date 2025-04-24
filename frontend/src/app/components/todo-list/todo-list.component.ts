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
  selectedCategory = 'All';
  private subscription!: Subscription;
  predefinedCategories = ['Client work', 'Personal work', 'Personal', 'Cooking', 'Others'];

  // Predefined category colors - same as in todo-item component for consistency
  private categoryColors: Record<string, string> = {
    'Client work': '#ff6b6b',  // Coral red
    'Personal work': '#4ecdc4', // Teal
    'Personal': '#ffbe76',     // Light orange
    'Cooking': '#7bed9f',      // Light green
    'Others': '#a29bfe',       // Lavender
    'General': '#74b9ff',      // Sky blue
    'Work': '#ff9f7f',         // Salmon
    'Shopping': '#ff7675',     // Pastel red 
    'Health': '#55efc4',       // Mint
    'All': '#cbd5e0'           // Light gray for "All" option
  };

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.subscription = this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  toggleCompletion(id: string): void {
    this.todoService.toggleCompletion(id);
  }

  updateTodo(event: { id: string, updates: Partial<Todo> }): void {
    this.todoService.updateTodo(event.id, event.updates);
  }

  getCategoryColor(category: string): string {
    // Use predefined color if available
    if (this.categoryColors[category]) {
      return this.categoryColors[category];
    }

    // Generate a color based on category name for consistency
    return this.generateColorFromString(category);
  }

  getCategoryTextColor(category: string): string {
    const bgColor = this.getCategoryColor(category);

    // If the color is in hex format
    if (bgColor.startsWith('#')) {
      // Convert hex to RGB
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);

      // Calculate luminance (perceived brightness)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Return white for dark backgrounds, dark for light backgrounds
      return luminance > 0.5 ? '#333333' : '#ffffff';
    }

    // For HSL colors, assume bright enough and use dark text
    return '#333333';
  }

  // Generate a consistent color from a string
  private generateColorFromString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Create a vibrant, non-grayscale color (ensure saturation)
    const h = Math.abs(hash) % 360; // Hue (0-360)
    const s = 60 + (Math.abs(hash) % 30); // Saturation (60-90%)
    const l = 65 + (Math.abs(hash) % 10); // Lightness (65-75%)

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  get categories(): string[] {
    const todoCategories = this.todos.map((todo) => todo.category);
    const allCategories = [...this.predefinedCategories, ...todoCategories];
    return Array.from(new Set(allCategories));
  }

  get filteredTodos(): Todo[] {
    if (this.selectedCategory === 'All') {
      return this.todos;
    } else {
      return this.todos.filter((todo) => todo.category === this.selectedCategory);
    }
  }
}
