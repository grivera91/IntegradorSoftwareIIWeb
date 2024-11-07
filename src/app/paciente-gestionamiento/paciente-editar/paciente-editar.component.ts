import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { PacienteService } from '../services/paciente.service';
import { PacienteUsuario } from '../../shared/interfaces/paciente/paciente-usuario-interface';
import { UsuarioEditarRequest } from '../../shared/interfaces/usuario/usuario-editar-request.interface';
import { PacienteEditRequest } from '../../shared/interfaces/paciente/paciente-editar-request.interface';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';
import { OpcionesPaciente } from '../../shared/interfaces/paciente/paciente-opciones.interface';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente-editar',
  standalone: true,
  templateUrl: './paciente-editar.component.html',
  styleUrls: ['./paciente-editar.component.css'],
  imports: [FormsModule, CommonModule]
})
export class PacienteEditarComponent {
  @Input() pacienteUsuario: PacienteUsuario | null = null;
  @Output() onClose = new EventEmitter<void>();

  pacienteRequest: PacienteEditRequest = this.resetPacienteRequest();
  usuarioRequest: UsuarioEditarRequest = this.resetUsuarioRequest();

  roles = OpcionesUsuarios.roles;
  generos = OpcionesUsuarios.generos;
  tiposSangre = OpcionesPaciente.tipoSangre;

  constructor(private usuarioService: UsuarioService, private pacienteService: PacienteService) {}

  ngOnInit() {
    if (this.pacienteUsuario) {
      this.fillRequests(this.pacienteUsuario);
    }
  }

  // Método para reiniciar el objeto pacienteRequest
  private resetPacienteRequest(): PacienteEditRequest {
    return {
      numeroHistoriaClinica: '',
      idTipoSangre: 0,
      alergias: '',
      enfermedadesPreexistentes: '',
      contactoEmergencia: '',
      numeroContactoEmergencia: '',
      observaciones: '',
      usuarioModificacion: ''
    };
  }

  // Método para reiniciar el objeto usuarioRequest
  private resetUsuarioRequest(): UsuarioEditarRequest {
    return {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      dni: 0,
      correoElectronico: '',
      fechaNacimiento: '',
      genero: 0,
      numeroTelefonico: '',
      direccion: '',
      contrasenia: '', // Solo se cambia si se ingresa una nueva
      rolUsuario: 0,
      esAdmin: false,
      usuarioModificacion: ''
    };
  }

  // Método para llenar los requests con la información de pacienteUsuario
  private fillRequests(pacienteUsuario: PacienteUsuario): void {    
    this.usuarioRequest = {
      ...this.usuarioRequest,
      nombre: pacienteUsuario.usuario.nombre,
      apellidoPaterno: pacienteUsuario.usuario.apellidoPaterno,
      apellidoMaterno: pacienteUsuario.usuario.apellidoMaterno || '',
      dni: pacienteUsuario.usuario.dni,
      correoElectronico: pacienteUsuario.usuario.correoElectronico,
      fechaNacimiento: this.formatFecha(pacienteUsuario.usuario.fechaNacimiento),
      genero: pacienteUsuario.usuario.genero,
      numeroTelefonico: pacienteUsuario.usuario.numeroTelefonico,
      direccion: pacienteUsuario.usuario.direccion,
      rolUsuario: pacienteUsuario.usuario.idUsuario,
      esAdmin: pacienteUsuario.usuario.idUsuario === 9, // Internamente manejar si es admin
      usuarioModificacion: 'admin'
    };

    this.pacienteRequest = {
      ...this.pacienteRequest,
      numeroHistoriaClinica: pacienteUsuario.paciente.codigoHistoriaClinica,
      idTipoSangre: pacienteUsuario.paciente.idTipoSangre,
      alergias: pacienteUsuario.paciente.alergias,
      enfermedadesPreexistentes: pacienteUsuario.paciente.enfermedadesPreexistentes,
      contactoEmergencia: pacienteUsuario.paciente.contactoEmergencia,
      numeroContactoEmergencia: pacienteUsuario.paciente.numeroContactoEmergencia,
      observaciones: pacienteUsuario.paciente.observaciones,
      usuarioModificacion: 'admin'
    };
  }

  // Método para formatear la fecha
  private formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Método general para manejar el éxito y el error de las solicitudes
  private handleResponse(successMessage: string) {
    Swal.fire({
      title: '¡Éxito!',
      text: successMessage,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.onClose.emit();  // Cierra el formulario de edición
    });
  }

  // Método general para manejar errores
  private handleError(errorMessage: string) {
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    console.error(errorMessage);
  }

  // Guardar cambios en usuario y paciente
  guardarCambios(): void {
    if (this.pacienteUsuario?.usuario.idUsuario && this.pacienteUsuario.paciente.idPaciente) {
      this.usuarioRequest.esAdmin = this.usuarioRequest.rolUsuario === 9;

      // Encadenar las dos llamadas, primero editar el usuario y luego el paciente
      this.usuarioService.editarUsuario(this.pacienteUsuario.usuario.idUsuario, this.usuarioRequest)
        .pipe(
          switchMap(() =>
            this.pacienteService.editarPaciente(this.pacienteUsuario!.paciente.idPaciente, this.pacienteRequest)
          )
        )
        .subscribe({
          next: () => this.handleResponse('Usuario y paciente actualizados correctamente.'),
          error: () => this.handleError('Ocurrió un error al actualizar los datos. Intenta nuevamente.')
        });
    } else {
      this.handleError('El ID del usuario o paciente es inválido.');
    }
  }

  cancelar(): void {
    this.onClose.emit();
  }
}
