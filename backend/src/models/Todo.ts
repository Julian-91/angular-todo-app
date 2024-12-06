import { Schema, model, Document } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    isCompleted: boolean;
    category: string;
}

const TodoSchema = new Schema<ITodo>({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    category: { 
        type: String, 
        default: 'General',
        set: function(value: string) {
            // If value is undefined, null, empty string or just whitespace, return 'General'
            if (!value || value.trim().length === 0) {
                return 'General';
            }
            return value.trim();
        }
    },
});

export default model<ITodo>('Todo', TodoSchema);
