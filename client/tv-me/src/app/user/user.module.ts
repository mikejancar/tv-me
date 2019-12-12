import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RegisterUserComponent } from './register-user/register-user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, RegisterUserComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
