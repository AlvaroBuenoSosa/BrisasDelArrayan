import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes'; // Importa las rutas definidas

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)], // Configura el enrutador en el nuevo formato standalone
};