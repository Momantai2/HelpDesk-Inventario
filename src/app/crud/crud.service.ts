import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../core/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CrudService<TResponse, TRequest = TResponse> {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apispirngUrl}`;

  getAll(endpoint: string): Observable<TResponse[]> {
    return this.http.get<TResponse[]>(`${this.apiUrl}/${endpoint}`);
  }

  getById(endpoint: string, id: number): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  create(endpoint: string, data: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiUrl}/${endpoint}`, data);
  }

  update(endpoint: string, id: number, data: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${id}`);
  }
}
