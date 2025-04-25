import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TodoFormComponent } from './todo-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';

const meta: Meta<TodoFormComponent> = {
    title: 'Components/TodoForm',
    component: TodoFormComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule],
        }),
    ],
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        addTodoEvent: { action: 'addTodoEvent' }
    }
};

export default meta;
type Story = StoryObj<TodoFormComponent>;

// Default state
export const Default: Story = {
    args: {
        categories: [
            { value: 'Work', label: 'Work' },
            { value: 'Personal', label: 'Personal' },
            { value: 'Shopping', label: 'Shopping' }
        ]
    }
};

// Empty categories
export const NoCategories: Story = {
    args: {
        categories: []
    }
};

// Many categories
export const ManyCategories: Story = {
    args: {
        categories: Array(10).fill(0).map((_, i) => ({
            value: `Category ${i + 1}`,
            label: `Category ${i + 1}`
        }))
    }
}; 