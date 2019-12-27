import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@tvme/user';

@Component({
  selector: 'tvme-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(
    public router: Router,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.checkLoginStatus();
  }
}
