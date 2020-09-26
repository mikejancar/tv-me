import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'tvme-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParamMap.pipe(
      tap((paramMap: ParamMap) => {
        if (paramMap.has('registered')) {
          this.snackBar.open('Congratulations! You\'ve successfully registered', 'Ok', {
            duration: 3000
          });
        }
      })
    ).subscribe();
  }
}
