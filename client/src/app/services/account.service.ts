import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public currentUser = signal<User | null>(null);
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = environment.apiUrl + '/account/';

  constructor() {
    const currentUser = localStorage.getItem('dAUser');
    if (currentUser) {
      const parsedObj = JSON.parse(currentUser);
      this.currentUser.set(parsedObj);
    }
  }

  public registerUser(model: any) {
    return this.http.post<User>(this.baseUrl + 'register', model)
      .pipe(map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      }));
  }

  public loginUser(model: any) {
    return this.http.post<User>(this.baseUrl + 'login', model)
      .pipe(map(user => {
        if (user) {
          this.setCurrentUser(user);
          this.router.navigateByUrl('/members');
        }
        return user;
      }));
  }

  public logoutUser() {
    localStorage.removeItem('dAUser');
    this.currentUser.set(null);
    this.router.navigateByUrl('/');
  }


  public setCurrentUser(user: User) {
    localStorage.setItem('dAUser', JSON.stringify(user));
    this.currentUser.set(user);
  }
}
