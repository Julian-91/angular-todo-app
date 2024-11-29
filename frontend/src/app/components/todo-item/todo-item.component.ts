import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Todo } from '../../models/todo.model'

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.todo._id);
  }

  onToggle(): void {
    this.toggle.emit(this.todo._id);
  }
}
