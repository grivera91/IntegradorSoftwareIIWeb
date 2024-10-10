import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Para ngModel
import { CommonModule } from '@angular/common';  // Para ngIf, ngFor, etc.
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CambiarContraseniaRequest } from '../interfaces/cambiar-contrasenia.interface';
import Swal from 'sweetalert2';  // Importar SweetAlert

@Component({
  selector: 'app-change-password',
  standalone: true,  // Indicar que es standalone
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports: [FormsModule, CommonModule]  // Importar FormsModule y CommonModule
})
export class ChangePasswordComponent {
  usuario: string = '';
  viejaContrasenia: string = '';
  nuevaContrasenia: string = '';
  confirmarContrasenia: string = '';

  constructor(private authService: AuthService, private router: Router) {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = usuarioGuardado;
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.nuevaContrasenia !== this.confirmarContrasenia) {
      Swal.fire({
        title: 'Error',
        text: 'Las nuevas contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const request: CambiarContraseniaRequest = {
      usuarioAcceso: this.usuario,
      contraseniaActual: this.viejaContrasenia,
      contraseniaNueva: this.nuevaContrasenia
    };

    this.authService.cambiarContrasenia(request).subscribe({
      next: () => {
        Swal.fire({
          title: 'Éxito',
          text: 'Contraseña actualizada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/login']); // Redirige al login al presionar "Aceptar"
        });
      },
      error: (error) => {
        let errorMessage = 'Ocurrió un error al cambiar la contraseña. Intenta nuevamente.';
        if (error.status === 400) {
          errorMessage = 'La contraseña actual es incorrecta.';
        }

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