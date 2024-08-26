import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';

@Component({
  selector: 'app-fortuna',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fortuna.component.html',
  styleUrl: './fortuna.component.scss'
})
export class FortunaComponent implements OnInit {

  ejemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService) { }

    ngOnInit(): void {
      this.ejemplaresService.getEjemplarById(3).subscribe(data => {
        this.ejemplar = data;
      });
    }

}
