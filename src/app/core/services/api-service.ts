import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Global API State Signals
  loading = signal(false);
  error = signal<string | null>(null);

  // App Info Signal
  apiInfo = signal({
    baseUrl: this.baseUrl,
    appName: environment.appName,
    version: environment.version,
    isProduction: environment.production
  });

  // =======================
  // GET - Angular automatically handles TransferState with withHttpTransferCacheOptions
  // =======================
  get<T>(endpoint: string): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  // =======================
  // GET - Returns Signal (uses built-in HTTP cache)
  // =======================
  getSignal<T>(endpoint: string) {
    const data = signal<T | null>(null);

    this.loading.set(true);
    this.error.set(null);

    this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      catchError((err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe({
      next: (res) => {
        data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
      }
    });

    return data;
  }

  // =======================
  // POST - Returns Observable
  // =======================
  post<T>(endpoint: string, body: unknown): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
        return of(null as T);
      })
    );
  }

  // =======================
  // PATCH - Returns Observable
  // =======================
  patch<T>(endpoint: string, body: unknown): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
        return of(null as T);
      })
    );
  }

  // =======================
  // PUT - Returns Observable
  // =======================
  put<T>(endpoint: string, body: unknown): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
        return of(null as T);
      })
    );
  }

  // =======================
  // DELETE - Returns Observable
  // =======================
  delete<T>(endpoint: string): Observable<T> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.error.set(err.message ?? 'Error');
        this.loading.set(false);
        return of(null as T);
      })
    );
  }
}
