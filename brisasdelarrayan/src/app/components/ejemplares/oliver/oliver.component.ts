import { Component, OnInit } from '@angular/core';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-oliver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oliver.component.html',
  styleUrl: './oliver.component.scss'
})
export class OliverComponent implements OnInit {

  ejemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService) { }

    ngOnInit(): void {
      this.ejemplaresService.getEjemplarById(5).subscribe(data => {
        this.ejemplar = data;
      });
    }

}
