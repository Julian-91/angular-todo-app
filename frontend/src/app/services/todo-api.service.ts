import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class TodoApiService {
    private apiUrl = `${environment.apiUrl}/todos`;

    constructor(private http: HttpClient) { }

    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.apiUrl);
    }

    addTodo(todo: Partial<Todo>): Observable<Todo> {
        return this.http.post<Todo>(this.apiUrl, todo);
    }

    deleteTodo(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    updateTodo(id: string, updates: Partial<Todo>): Observable<Todo> {
        return this.http.patch<Todo>(`${this.apiUrl}/${id}`, updates);
    }
}