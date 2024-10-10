import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UsuarioService } from '../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioEditarRequest } from '../../shared/interfaces/usuario/usuario-editar-request.interface';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';  // Importa las opciones centralizadas
import Swal from 'sweetalert2';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class UsuarioEditarComponent {
  @Input() usuario: UsuarioRegistroResponse | null = null;
  @Output() onClose = new EventEmitter<void>();

  usuarioRequest: UsuarioEditarRequest = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: 0,
    correoElectronico: '',
    fechaNacimiento: '',
    genero: 0,
    numeroTelefonico: '',
    direccion: '',
    contrasenia: '', // Contraseña opcional
    rolUsuario: 0,
    esAdmin: false,    
    usuarioModificacion: ''
  };

  // Usar las listas centralizadas
  roles = OpcionesUsuarios.roles;
  generos = OpcionesUsuarios.generos;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    // Si el usuario está disponible, llenar los campos del request con sus valores
    if (this.usuario) {
      this.usuarioRequest = {
        nombre: this.usuario.nombre,
        apellidoPaterno: this.usuario.apellidoPaterno,
        apellidoMaterno: this.usuario.apellidoMaterno || '',
        dni: this.usuario.dni,
        correoElectronico: this.usuario.correoElectronico,
        fechaNacimiento: this.formatFecha(this.usuario.fechaNacimiento),
        genero: this.usuario.genero,
        numeroTelefonico: this.usuario.numeroTelefonico,
        direccion: this.usuario.direccion,
        contrasenia: '', // Solo se cambia si se ingresa una nueva
        rolUsuario: this.usuario.rolUsuario,
        esAdmin: this.usuario.rolUsuario === 9, // Internamente manejar si es admin
        usuarioModificacion: 'admin'
      };
    }
  }

  // Método para formatear la fecha
  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Lógica para guardar cambios y manejar internamente el campo esAdmin
  guardarCambios(): void {
    // Forzar esAdmin solo si el rol es Administrador (9)
    this.usuarioRequest.esAdmin = this.usuarioRequest.rolUsuario === 9;

    this.usuarioService.editarUsuario(this.usuario!.idUsuario, this.usuarioRequest).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.onClose.emit();  // Cierra el formulario de edición
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Ocur rió un error al actualizar el usuario. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  cancelar(): void {
    this.onClose.emit();
  }
}
