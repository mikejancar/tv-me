import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tvme-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(public router: Router) { }
}
