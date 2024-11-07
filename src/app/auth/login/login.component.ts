import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AutenticacionRequest } from '../interfaces/autenticacion-request.interface';
import Swal from 'sweetalert2';
import { AutenticacionTokenResponse } from '../interfaces/autenticacion-response-token.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  usuario: string = '';
  contrasenia: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const loginRequest: AutenticacionRequest = { usuarioAcceso: this.usuario, contrasenia: this.contrasenia };
    this.authService.login(loginRequest).subscribe({
      next: (response: AutenticacionTokenResponse) => this.procesarLoginExitoso(response),
      error: (error) => this.mostrarMensajeError(error)
    });
  }

  private procesarLoginExitoso(response: AutenticacionTokenResponse): void {
    // Guarda el token y redirige al dashboard
    this.authService.guardarToken(response.token);
    this.router.navigate(['/dashboard']);
    
    // Muestra mensaje de bienvenida
    Swal.fire({
      title: 'Bienvenido',
      text: 'Has ingresado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  private mostrarMensajeError(error: any): void {
    let errorMessage = 'Error desconocido. Verifica tu conexión e intenta nuevamente.';
    let errorIcon: 'error' | 'warning' = 'error';

    switch (error.status) {
      case 400:
        errorMessage = 'El nombre de usuario y la contraseña son obligatorios.';
        break;
      case 401:
        errorMessage = 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
        break;
      case 403:
        errorIcon = 'warning';
        if (error.error.message.includes('ha vencido')) {
          Swal.fire({
            title: 'Advertencia',
            text: 'Tu contraseña ha vencido. Por favor, cámbiala para continuar.',
            icon: 'warning',
            confirmButtonText: 'Continuar',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem('usuario', this.usuario);
              this.router.navigate(['/change-password']);
            }
          });
          return; // Salir de la función para evitar mostrar el mensaje de error final
        } else {
          errorMessage = 'Tu cuenta está desactivada. Contacta al administrador.';
        }
        break;
      case 500:
        errorMessage = 'Ocurrió un error en el servidor. Por favor, intenta nuevamente.';
        break;
      default:
        errorMessage = 'Error desconocido. Verifica tu conexión e intenta nuevamente.';
        break;
    }

    // Muestra el mensaje de error con SweetAlert
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: errorIcon,
      confirmButtonText: 'Aceptar'
    });
  }
}
