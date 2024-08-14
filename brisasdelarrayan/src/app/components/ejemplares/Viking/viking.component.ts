import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';

@Component({
  selector: 'app-viking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viking.component.html',
  styleUrl: './viking.component.scss'
})
export class VikingComponent implements OnInit {
[x: string]: any;

  ejemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService) { }

    ngOnInit(): void {
      this.ejemplaresService.getEjemplarById(1).subscribe(data => {
        this.ejemplar = data;
      });
    }

}
