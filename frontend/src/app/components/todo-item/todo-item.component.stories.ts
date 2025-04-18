import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TodoItemComponent } from './todo-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

const meta: Meta<TodoItemComponent> = {
    title: 'Components/TodoItem',
    component: TodoItemComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule],
        }),
    ],
    tags: ['autodocs'],
    argTypes: {
        delete: {
            action: 'delete',
            description: 'Event emitted when todo is deleted'
        },
        toggle: {
            action: 'toggle',
            description: 'Event emitted when todo completion status is toggled'
        },
        update: {
            action: 'update',
            description: 'Event emitted when todo is updated'
        },
        todo: {
            description: 'The todo item to display'
        },
        availableCategories: {
            description: 'List of available categories to choose from',
            control: 'object'
        }
    },
    args: {
        availableCategories: ['Work', 'Personal', 'Shopping', 'Health', 'Learning']
    }
};

export default meta;
type Story = StoryObj<TodoItemComponent>;

export const Default: Story = {
    args: {
        todo: {
            _id: '1',
            title: 'Complete the project',
            isCompleted: false,
            category: 'Work'
        }
    }
};

export const Completed: Story = {
    args: {
        todo: {
            _id: '2',
            title: 'Read documentation',
            isCompleted: true,
            category: 'Learning'
        }
    }
};

export const LongTitle: Story = {
    args: {
        todo: {
            _id: '3',
            title: 'This is a very long todo item title that might need special handling in the UI to ensure it displays correctly and doesn\'t break the layout of the application even with extended text',
            isCompleted: false,
            category: 'Work'
        }
    }
};

export const NoCategory: Story = {
    args: {
        todo: {
            _id: '4',
            title: 'Task without category',
            isCompleted: false,
            category: ''
        }
    }
};

export const SpecialCharacters: Story = {
    args: {
        todo: {
            _id: '5',
            title: 'Test & verify <script> tags & "quotes" handling',
            isCompleted: false,
            category: 'Testing'
        }
    }
};

export const CustomCategory: Story = {
    args: {
        todo: {
            _id: '6',
            title: 'Custom category task',
            isCompleted: false,
            category: 'Custom Category'
        },
        availableCategories: ['Work', 'Personal', 'Custom Category']
    }
};

export const ManyCategories: Story = {
    args: {
        todo: {
            _id: '7',
            title: 'Task with many categories',
            isCompleted: false,
            category: 'Category 1'
        },
        availableCategories: [
            'Category 1',
            'Category 2',
            'Category 3',
            'Category 4',
            'Category 5',
            'Category 6',
            'Category 7',
            'Category 8',
            'Category 9',
            'Category 10'
        ]
    }
};

export const EmojiTitle: Story = {
    args: {
        todo: {
            _id: '8',
            title: '🎯 Complete task with emoji 🚀',
            isCompleted: false,
            category: 'Fun'
        }
    }
};

export const EditTodo: Story = {
    args: {
        todo: {
            _id: '1',
            title: 'Complete the project',
            isCompleted: false,
            category: 'Work'
        },
        isEditing: true,
        editedTitle: 'Complete the project',
        editedCategory: 'Work'
    }
};