import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TodoListComponent } from './todo-list.component';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoService } from '../../services/todo.service';

const meta: Meta<TodoListComponent> = {
    title: 'Components/TodoList',
    component: TodoListComponent,
    decorators: [
        moduleMetadata({
            imports: [FormsModule, TodoItemComponent],
            providers: [TodoService],
        }),
    ],
};

export default meta;
type Story = StoryObj<TodoListComponent>;

export const Default: Story = {
    args: {},
};
