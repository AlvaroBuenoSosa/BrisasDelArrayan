import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Importa las rutas definidas

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)], // Configura el enrutador en el nuevo formato standalone
};