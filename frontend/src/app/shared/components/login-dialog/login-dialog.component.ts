import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from '../../../core/services/auth/auth-service.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    const success = this.authService.login(
      this.username.trim(),
      this.password.trim()
    );

    if (!success) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      return;
    }

    this.dialogRef.close();

    this.router.navigate(['/admin']);
  }

  close(): void {
    this.dialogRef.close();
  }
}