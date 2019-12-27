import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';



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
    // this.userService.registerNewUser(this.username.value, this.password.value).pipe(
    //   map((wasSuccessful: boolean) => {
    //     if (wasSuccessful) {
    //       this.router.navigate(['user', 'profile'], { queryParams: { registered: true } });
    //     } else {
    //       this.snackBar.open('Registration failed. Please try again later');
    //     }
    //   })
    // ).subscribe();
  }
}
