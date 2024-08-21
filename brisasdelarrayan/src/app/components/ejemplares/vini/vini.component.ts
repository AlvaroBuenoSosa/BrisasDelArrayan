import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EjemplaresService } from '../../../shared/services/ejemplares.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vini',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vini.component.html',
  styleUrl: './vini.component.scss'
})
export class ViniComponent implements OnInit {

  ejemplar: any;

  constructor(
    private ejemplaresService: EjemplaresService) { }

    ngOnInit(): void {
      this.ejemplaresService.getEjemplarById(2).subscribe(data => {
        this.ejemplar = data;
      });
    }

}


