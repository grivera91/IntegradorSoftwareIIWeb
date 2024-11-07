import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!this.authService.obtenerToken();
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
    }
    return isAuthenticated;
  }
}
