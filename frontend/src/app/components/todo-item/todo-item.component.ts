import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model'

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() availableCategories: string[] = [];
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string, updates: Partial<Todo> }>();

  // Predefined category colors
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

  isEditing = false;
  isDescriptionExpanded = false;
  editedTitle = '';
  editedDescription = '';
  editedCategory = '';

  private MAX_PREVIEW_LENGTH = 100;

  onDelete(): void {
    this.delete.emit(this.todo._id);
  }

  onToggle(): void {
    this.toggle.emit(this.todo._id);
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  hasDescription(): boolean {
    return !!this.todo.description && this.todo.description.trim().length > 0;
  }

  getDescriptionPreview(): string {
    if (!this.todo.description) return '';

    if (this.todo.description.length <= this.MAX_PREVIEW_LENGTH) {
      return this.todo.description;
    }

    return this.todo.description.substring(0, this.MAX_PREVIEW_LENGTH) + '...';
  }

  shouldShowToggle(): boolean {
    return this.hasDescription() && this.todo.description.length > this.MAX_PREVIEW_LENGTH;
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
    // Convert hex to RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, dark for light backgrounds
    return luminance > 0.5 ? '#333333' : '#ffffff';
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

  startEditing(): void {
    this.editedTitle = this.todo.title;
    this.editedDescription = this.todo.description || '';
    this.editedCategory = this.todo.category;
    this.isEditing = true;
    this.isDescriptionExpanded = true; // Always show description when editing
  }

  saveEdits(): void {
    if (this.editedTitle.trim()) {
      this.update.emit({
        id: this.todo._id,
        updates: {
          title: this.editedTitle.trim(),
          description: this.editedDescription.trim(),
          category: this.editedCategory || 'General'
        }
      });
      this.isEditing = false;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedTitle = this.todo.title;
    this.editedDescription = this.todo.description || '';
    this.editedCategory = this.todo.category;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEdits();
    } else if (event.key === 'Escape') {
      this.cancelEditing();
    }
  }

  get uniqueCategories(): string[] {
    // Combine current todo category with available categories and remove duplicates
    const allCategories = ['General', ...this.availableCategories, this.todo.category];
    return [...new Set(allCategories)];
  }
}