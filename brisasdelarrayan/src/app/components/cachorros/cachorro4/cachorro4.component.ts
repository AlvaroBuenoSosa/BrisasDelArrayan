import { Component, OnInit } from '@angular/core';
import { CachorrosService } from '../../../shared/services/cachorros.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cachorro4',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cachorro4.component.html',
  styleUrl: './cachorro4.component.scss'
})
export class Cachorro4Component implements OnInit {

  cachorro: any;

  constructor(
    private cachorroService: CachorrosService) { }

    ngOnInit(): void {
      this.cachorroService.getCachorroById(4).subscribe(data => {
        this.cachorro = data;
      });
    }

}
