import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { AddTodoPageComponent } from './components/add-todo-page/add-todo-page.component';

export const routes: Routes = [
    {
        path: '',
        component: TodoListComponent
    },
    {
        path: 'add',
        component: AddTodoPageComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
