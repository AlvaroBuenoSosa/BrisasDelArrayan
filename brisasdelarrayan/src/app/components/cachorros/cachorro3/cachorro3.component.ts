import { Component, OnInit } from '@angular/core';
import { CachorrosService } from '../../../shared/services/cachorros.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cachorro3',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cachorro3.component.html',
  styleUrl: './cachorro3.component.scss'
})
export class Cachorro3Component implements OnInit {

  cachorro: any;

  constructor(
    private cachorroService: CachorrosService) { }

    ngOnInit(): void {
      this.cachorroService.getCachorroById(3).subscribe(data => {
        this.cachorro = data;
      });
    }

}
