import { Component, OnInit } from '@angular/core';
import { CachorrosService } from '../../../shared/services/cachorros.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cachorro2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cachorro2.component.html',
  styleUrl: './cachorro2.component.scss'
})
export class Cachorro2Component implements OnInit {

  cachorro: any;

  constructor(
    private cachorroService: CachorrosService) { }

    ngOnInit(): void {
      this.cachorroService.getCachorroById(2).subscribe(data => {
        this.cachorro = data;
      });
    }

}