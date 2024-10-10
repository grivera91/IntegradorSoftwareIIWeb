import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AutenticacionRequest } from '../interfaces/autenticacion-request.interface';
import { AutenticacionResponse } from '../interfaces/autenticacion-response.interface';
import Swal from 'sweetalert2';  // Importar SweetAlert

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
      next: (response: AutenticacionResponse) => {
        localStorage.setItem('datosUsuario', JSON.stringify(response));
        console.log('Login exitoso:', response);        
        this.router.navigate(['/dashboard']);
        Swal.fire({
          title: 'Bienvenido',
          text: 'Has ingresado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        let errorMessage = 'Error desconocido. Verifica tu conexión e intenta nuevamente.';
        let errorIcon = 'error';

        // Utilizar switch para los diferentes códigos de error
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
                allowOutsideClick: false  // Evita que se cierre al hacer clic fuera de la alerta
              }).then((result) => {
                if (result.isConfirmed) {
                  // Redirigir al formulario de cambio de contraseña
                  localStorage.setItem('usuario', this.usuario);  // Guardar el usuario
                  this.router.navigate(['/change-password']);
                }
              });
              return; // Salir de la función para no ejecutar el Swal.fire final
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

        // Mostrar el mensaje de error con SweetAlert
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
