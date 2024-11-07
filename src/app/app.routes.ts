import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';  // Importa con soporte para interceptores
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

export const appConfig = [
  provideRouter(routes),
  provideHttpClient(withInterceptorsFromDi()), // Habilita el uso de interceptores
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Agrega el interceptor de autenticación
];
