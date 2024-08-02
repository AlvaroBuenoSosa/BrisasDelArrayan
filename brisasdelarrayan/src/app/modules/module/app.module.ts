import { NgModule } from '@angular/core';
import { EjemplaresComponent } from '../../components/ejemplares/ejemplares.component';
import { CachorrosComponent } from '../../components/cachorros/cachorros.component';
import { CamadasComponent } from '../../components/camadas/camadas.component';
import { AppComponent } from '../../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NovedadesComponent } from '../../components/novedades/novedades.component';
import { CommonModule } from '@angular/common';

NgModule({
  declarations: [
    AppComponent,
    CachorrosComponent,
    EjemplaresComponent,
    CamadasComponent,
    NovedadesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }