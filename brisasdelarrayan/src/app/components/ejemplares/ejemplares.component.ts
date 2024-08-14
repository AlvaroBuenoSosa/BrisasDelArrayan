import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../shared/services/ejemplares.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ejemplares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejemplares.component.html',
  styleUrl: './ejemplares.component.scss'
})
export class EjemplaresComponent implements OnInit {
  ejemplares: any[] = [];
  id: any;
  nombre: string | undefined;

  constructor(
    private ejemplaresService: EjemplaresService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.ejemplaresService.getEjemplares().subscribe(data => {
      this.ejemplares = data;
    });
  }
  
  goToEjemplar(nombre: string) {
    this.router.navigate([`/ejemplares/${nombre}`]);
  }

}
