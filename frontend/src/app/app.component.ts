import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importa Angular Material Dialog y el componente del login dialog
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginDialogComponent } from '../app/components/login-dialog/login-dialog.component';  // ajusta ruta si hace falta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './app.component.html',  // añade esta línea
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private dialog: MatDialog) {}

  abrirLoginModal() {
    this.dialog.open(LoginDialogComponent, {
      width: '300px',
      disableClose: true
    });
  }
}

