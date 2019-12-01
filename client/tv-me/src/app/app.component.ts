import { Component } from '@angular/core';

@Component({
  selector: 'tvme-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchSeries(): void {
    alert('searching');
  }
}
