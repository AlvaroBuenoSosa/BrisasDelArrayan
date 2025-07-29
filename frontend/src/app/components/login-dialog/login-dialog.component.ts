import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';  // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2>Iniciar Sesión</h2>
    <form (ngSubmit)="login($event)" #loginForm="ngForm">
      <mat-form-field style="width: 100%;">
        <input matInput placeholder="Usuario" [(ngModel)]="username" name="username" required />
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <input matInput type="password" placeholder="Contraseña" [(ngModel)]="password" name="password" required />
      </mat-form-field>

      <div *ngIf="error" style="color: red; margin-bottom: 10px;">{{ error }}</div>

      <div style="text-align: right;">
        <button mat-button type="button" (click)="cancelar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.form.valid">Entrar</button>
      </div>
    </form>
  `
})
export class LoginDialogComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('Modal LoginDialogComponent abierto');
  }


login(event: Event) {
  event.preventDefault();
  const user = this.username.trim();
  const pass = this.password.trim();

  const success = this.authService.login(user, pass);

  if (success) {
    this.dialogRef.close();
    this.router.navigate(['/admin']);
  } else {
    this.error = 'Usuario o contraseña incorrectos';
  }
}


  cancelar() {
    this.dialogRef.close(false);
  }
}
