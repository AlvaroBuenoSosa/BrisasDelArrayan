import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EjemplaresComponent } from '../../components/ejemplares/ejemplares.component';
import { CachorrosComponent } from '../../components/cachorros/cachorros.component';
import { CamadasComponent } from '../../components/camadas/camadas.component';
import { AppComponent } from '../../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { routes } from '../../app.routes';

NgModule({
  declarations: [
    AppComponent,
    CachorrosComponent,
    EjemplaresComponent,
    CamadasComponent,
    EjemplaresComponent
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }