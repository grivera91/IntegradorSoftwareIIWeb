import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Para ngModel
import { CommonModule } from '@angular/common';  // Importa CommonModule para ngIf, ngFor, etc.
import { UsuarioService } from '../services/usuario.service';
import { UsuarioResumenComponent } from '../usuario-resumen/usuario-resumen.component';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';  // Importa las opciones centralizadas
import Swal from 'sweetalert2';  // Importar SweetAlert2
import { NgForm } from '@angular/forms';
import { UsuarioRegistroRequest } from '../../shared/interfaces/usuario/usuario-registro-request.interface';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';

@Component({
  selector: 'app-register-user',
  standalone: true,
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
  imports: [FormsModule, CommonModule, UsuarioResumenComponent]
})
export class RegisterUserComponent {
  @Output() onClose = new EventEmitter<void>(); 

  nombre: string = '';
  apellidoPaterno: string = ''; 
  apellidoMaterno: string = '';
  dni: string = '';  
  correoElectronico: string = '';
  fechaNacimiento: string = '';  
  genero: string = '';  
  numeroTelefonico: string = '';
  direccion: string = '';
  usuarioAcceso: string = '';  
  contrasenia: string = '';  
  confirmarContrasenia: string = '';  
  rolUsuario: string = '';  
  esAdmin: boolean = false;  // Manejado internamente
  usuarioRegistrado: UsuarioRegistroResponse | null = null;  

  // Usar las listas centralizadas
  roles = OpcionesUsuarios.roles;
  generos = OpcionesUsuarios.generos;

  constructor(private usuarioService: UsuarioService) {}

  // Método para cambiar el estado de esAdmin según el rol seleccionado
  onRoleChange(): void {
    if (this.rolUsuario === '9') {  // Si el rol seleccionado es Administrador (rol 9)
      this.esAdmin = true;  // Forzar esAdmin a true para Administrador
    } else {
      this.esAdmin = false;  // Forzar esAdmin a false para otros roles
    }
  }

  // Generar el nombre de usuario basado en nombre y apellido paterno
  onNameOrSurnameChange(): void {
    if (this.nombre && this.apellidoPaterno) {
      const apellidoPaternoSinEspacios = this.apellidoPaterno.replace(/\s+/g, '');
      this.usuarioAcceso = `${this.nombre.charAt(0).toLowerCase()}${apellidoPaternoSinEspacios.toLowerCase()}`;
    }
  }

  // Enviar el formulario
  onSubmit(registerForm: NgForm): void {
    if (registerForm.invalid) {
      registerForm.form.markAllAsTouched();
      return;
    }

    if (this.contrasenia !== this.confirmarContrasenia) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (this.genero === '') {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un género.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (this.rolUsuario === '') {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un rol de usuario.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const nuevoUsuario: UsuarioRegistroRequest = {      
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      dni: parseInt(this.dni, 10),
      correoElectronico: this.correoElectronico,
      fechaNacimiento: new Date(this.fechaNacimiento).toISOString(),
      genero: parseInt(this.genero, 10),
      numeroTelefonico: this.numeroTelefonico,
      direccion: this.direccion,
      usuarioAcceso: this.usuarioAcceso,
      contrasenia: this.contrasenia,
      rolUsuario: parseInt(this.rolUsuario, 10),
      esAdmin: this.esAdmin,  // Se envía internamente sin mostrar al usuario
      usuarioCreacion: 'admin'
    };

    this.usuarioService.registrarUsuario(nuevoUsuario).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Usuario registrado!',
          text: 'El usuario ha sido registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.usuarioRegistrado = response;
        this.resetForm();
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al registrar el usuario. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  resetForm(): void {
    this.nombre = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.dni = '';
    this.correoElectronico = '';
    this.fechaNacimiento = '';
    this.genero = '';
    this.numeroTelefonico = '';
    this.direccion = '';
    this.usuarioAcceso = '';
    this.contrasenia = '';
    this.confirmarContrasenia = ''; 
    this.rolUsuario = '';
    this.esAdmin = false;  // Reiniciar el valor de esAdmin
  }

  cerrarFormulario(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cancelar el registro y cerrar el formulario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onClose.emit();
        Swal.fire(
          'Cancelado',
          'El formulario ha sido cerrado.',
          'success'
        );
      }
    });
  }

  finalizarFormulario():void{
    this.onClose.emit();
  }
}
