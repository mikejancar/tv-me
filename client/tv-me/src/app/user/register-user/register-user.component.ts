import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { matchingValuesValidator } from '@tvme/matching-values.validator';

import { UserService } from '../user.service';

@Component({
  selector: 'tvme-register-user',
  templateUrl: './register-user.component.html'
})
export class RegisterUserComponent implements OnInit {
  registrationForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPass: ['']
  });

  username = this.registrationForm.controls.username;
  password = this.registrationForm.controls.password;
  confirmPass = this.registrationForm.controls.confirmPass;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.confirmPass.setValidators([Validators.required, matchingValuesValidator(this.password)]);
    this.confirmPass.updateValueAndValidity();
  }

  onSubmit(): void {
    this.userService.registerNewUser(this.username.value, this.password.value).pipe(
      map((wasSuccessful: boolean) => {
        if (wasSuccessful) {
          this.router.navigate(['user', 'profile'], { queryParams: { registered: true } });
        } else {
          this.snackBar.open('Registration failed. Please try again later');
        }
      })
    ).subscribe();
  }
}
