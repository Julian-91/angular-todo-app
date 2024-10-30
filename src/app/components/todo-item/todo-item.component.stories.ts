import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TodoItemComponent } from './todo-item.component';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

const meta: Meta<TodoItemComponent> = {
    title: 'Components/TodoItem',
    component: TodoItemComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
        }),
    ],
    argTypes: {
        delete: { action: 'delete' },
        toggle: { action: 'toggle' },
    },
};

export default meta;
type Story = StoryObj<TodoItemComponent>;

export const Default: Story = {
    args: {
        todo: {
            id: 1,
            title: 'Sample Todo',
            isCompleted: false,
        } as Todo,
    },
};

export const Completed: Story = {
    args: {
        todo: {
            id: 2,
            title: 'Completed Todo',
            isCompleted: true,
        } as Todo,
    },
};
