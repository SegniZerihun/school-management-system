import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://school-backend-din7.onrender.com/api/auth';
  private userRole: string | null = null;
  private userId: string | null = null; 
  private token: string | null = null;

  // A BehaviorSubject to keep track of the user's logged-in status
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {
    this.token = this.getToken();
  }

  // The login method that calls the backend
  login(credentials: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // When login is successful, store the token
        this.setToken(response.token);
        this.loggedIn.next(true); // Notify subscribers that user is logged in
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.userRole = null;
    this.token = null;
    this.loggedIn.next(false); // Notify subscribers that user is logged out
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.token = token;
    // Decode the token to get the role
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.userRole = payload.user.role;
    this.userId = payload.user.id; 
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  
  // Method to get the current user's role
  getRole(): string | null {
    if (!this.userRole && this.hasToken()) {
      const token = this.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userRole = payload.user.role;
      }
    }
    return this.userRole;
  }
  getUserId(): string | null {
    if (!this.userId && this.hasToken()) {
        const token = this.getToken();
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.userId = payload.user.id;
        }
    }
    return this.userId;
  }
}