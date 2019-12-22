import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@tvme/material.module';

import { ProfileComponent } from './profile/profile.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, RegisterUserComponent, ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    UserRoutingModule
  ]
})
export class UserModule { }
