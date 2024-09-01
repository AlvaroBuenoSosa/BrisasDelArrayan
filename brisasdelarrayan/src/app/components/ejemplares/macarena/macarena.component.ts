import { Component, OnInit } from '@angular/core';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-macarena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './macarena.component.html',
  styleUrl: './macarena.component.scss'
})
export class MacarenaComponent implements OnInit {

  ejemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService) { }

    ngOnInit(): void {
      this.ejemplaresService.getEjemplarById(6).subscribe(data => {
        this.ejemplar = data;
      });
    }

}

