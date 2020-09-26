import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { UserService } from '../user.service';

@Component({
  selector: 'tvme-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  username = this.loginForm.controls.username;
  password = this.loginForm.controls.password;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  onSubmit(): void {
    this.userService.login(this.username.value, this.password.value).pipe(
      tap((wasSuccessful: boolean) => {
        if (wasSuccessful) {
          this.router.navigate(['/']);
        } else {
          this.snackBar.open('Login failed. Please try again later', 'Ok', { duration: 5000 });
        }
      })
    ).subscribe();
  }
}
