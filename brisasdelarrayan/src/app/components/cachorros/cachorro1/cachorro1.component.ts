import { Component, OnInit } from '@angular/core';
import { CachorrosService } from '../../../shared/services/cachorros.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cachorro1',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cachorro1.component.html',
  styleUrl: './cachorro1.component.scss'
})
export class Cachorro1Component implements OnInit {

  cachorro: any;

  constructor(
    private cachorroService: CachorrosService) { }

    ngOnInit(): void {
      this.cachorroService.getCachorroById(1).subscribe(data => {
        this.cachorro = data;
      });
    }

}
