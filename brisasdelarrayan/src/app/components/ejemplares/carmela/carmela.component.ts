import { Component, OnInit } from '@angular/core';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carmela',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carmela.component.html',
  styleUrl: './carmela.component.scss'
})
export class CarmelaComponent implements OnInit{

  ejemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService) { }

    ngOnInit(): void {
      this.ejemplaresService.getEjemplarById(4).subscribe(data => {
        this.ejemplar = data;
      });
    }

}