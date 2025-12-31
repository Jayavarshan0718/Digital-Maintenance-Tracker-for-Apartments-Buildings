import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  signin(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/signin`, { email, password });
  }

  signup(userData: any) {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  setCurrentUser(user: any) {
    const userData = { ...user, token: user.token };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
    console.log('User set in auth service:', userData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}