import { Component, OnInit } from '@angular/core';
import { CachorrosService } from '../../../shared/services/cachorros.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cachorro5',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cachorro5.component.html',
  styleUrl: './cachorro5.component.scss'
})
export class Cachorro5Component implements OnInit {

  cachorro: any;

  constructor(
    private cachorroService: CachorrosService) { }

    ngOnInit(): void {
      this.cachorroService.getCachorroById(5).subscribe(data => {
        this.cachorro = data;
      });
    }

}
