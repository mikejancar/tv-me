import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '@tvme-env/environment';
import { User } from '@tvme/models';

interface UserLogin {
  username: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: BehaviorSubject<User> = new BehaviorSubject<User>({ username: '' });
  isRegistered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  checkLoginStatus(): void {
    const now = new Date();
    const userLoginStored = localStorage.getItem('user');

    if (userLoginStored) {
      const userLogin: UserLogin = JSON.parse(userLoginStored);
      if (userLogin.expiresAt > now.getDate()) {
        this.isLoggedIn$.next(true);
      } else {
        this.isLoggedIn$.next(false);
      }
    } else {
      this.isLoggedIn$.next(false);
    }
  }

  getUser(username: string): void {
    this.http.get(`${environment.tvmeApiUrl}/users/${username}`).pipe(
      map((user: User) => {
        this.isRegistered$.next(true);
        this.user$.next(user);
      }),
      catchError((error: any) => {
        if (error.status === 404) {
          this.isRegistered$.next(false);
        }
        console.log(error);
        return of(error);
      })
    );
  }

  registerNewUser(emailAddress: string, password: string): Observable<boolean> {
    return this.http.post(`${environment.tvmeApiUrl}/users`, { emailAddress, password }).pipe(
      map(() => {
        this.isRegistered$.next(true);
        this.saveUserLogin(emailAddress);
        return true;
      }),
      catchError((error: any) => {
        console.log(error);
        return of(false);
      })
    );
  }

  removeUserLogin(): void {
    localStorage.removeItem('user');
  }

  saveUserLogin(username: string): void {
    const now = new Date();
    const userData: UserLogin = {
      username,
      expiresAt: now.setDate(now.getDate() + 7)
    };
    localStorage.setItem('user', JSON.stringify(userData));
    this.isLoggedIn$.next(true);
  }
}
