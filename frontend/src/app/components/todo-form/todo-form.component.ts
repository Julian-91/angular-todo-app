import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  @Input() categories: string[] = [];
  @Input() navigateToListAfterAdd: boolean = false;
  @Output() addTodoEvent = new EventEmitter<{
    title: string;
    description: string;
    category: string;
  }>();

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
    'Health': '#55efc4'        // Mint
  };

  newTodoTitle = '';
  newTodoDescription = '';
  newTodoCategory = '';

  constructor(private router: Router) { }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      const category = this.newTodoCategory.trim() || 'General';
      this.addTodoEvent.emit({
        title: this.newTodoTitle.trim(),
        description: this.newTodoDescription.trim(),
        category
      });
      this.resetForm();

      // Only navigate if explicitly requested
      if (this.navigateToListAfterAdd) {
        this.router.navigate(['/']);
      }
    }
  }

  resetForm(): void {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoCategory = '';
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
}
