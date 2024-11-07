import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http'; // Asegura que HttpClient y los interceptores estén disponibles

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi() // Habilita los interceptores en un contexto standalone
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Configura el interceptor de autenticación
  ]
}).catch(err => console.error(err));
