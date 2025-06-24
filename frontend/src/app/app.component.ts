import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule

@Component({
  selector: 'app-root',
  standalone: true,  // Componente independiente
  imports: [CommonModule, RouterModule],  // Importa CommonModule y RouterModule
  template: `
    <nav>
      <a [routerLink]="['/ejemplares']">Ejemplares</a>
      <a [routerLink]="['/cachorros']">Cachorros</a>
      <a [routerLink]="['/camadas']">Camadas</a>
    </nav>
    <router-outlet></router-outlet>
  `,  // Aquí se cargan las rutas
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
}
