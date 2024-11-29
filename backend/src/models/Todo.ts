import { Schema, model, Document } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    isCompleted: boolean;
    category: string;
}

const TodoSchema = new Schema<ITodo>({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    category: { type: String, default: 'General' },
});

export default model<ITodo>('Todo', TodoSchema);
