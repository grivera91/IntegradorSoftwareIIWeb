import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';  // Importa tu componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirigir al login por defecto
];
