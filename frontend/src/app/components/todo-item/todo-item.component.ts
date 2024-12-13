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
  @Output() update = new EventEmitter<{id: string, updates: Partial<Todo>}>();

  isEditing = false;
  editedTitle = '';
  editedCategory = '';

  onDelete(): void {
    this.delete.emit(this.todo._id);
  }

  onToggle(): void {
    this.toggle.emit(this.todo._id);
  }

  startEditing(): void {
    this.editedTitle = this.todo.title;
    this.editedCategory = this.todo.category;
    this.isEditing = true;
  }

  saveEdits(): void {
    if (this.editedTitle.trim()) {
      this.update.emit({
        id: this.todo._id,
        updates: {
          title: this.editedTitle.trim(),
          category: this.editedCategory || 'General'
        }
      });
      this.isEditing = false;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedTitle = this.todo.title;
    this.editedCategory = this.todo.category;
  }

  // Handle Enter key to save and Escape key to cancel
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEdits();
    } else if (event.key === 'Escape') {
      this.cancelEditing();
    }
  }
}
