import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { LoginDialogComponent } from '../../login-dialog/login-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private dialog: MatDialog) {}

  openLoginModal(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '350px',
      disableClose: true
    });
  }
}