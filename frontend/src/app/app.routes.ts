import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { HeaderComponent } from './components/header/header.component';

export const routes: Routes = [
    {
        path: '',
        component: TodoListComponent
    }
];
