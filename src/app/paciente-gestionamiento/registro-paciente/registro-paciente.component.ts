import { Component, EventEmitter, Output } from '@angular/core';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { PacienteService } from '../services/paciente.service';
import { UsuarioRegistroRequest } from '../../shared/interfaces/usuario/usuario-registro-request.interface';
import { PacienteRegistroRequest } from '../../shared/interfaces/paciente/paciente-registro-request.interface';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';
import Swal from 'sweetalert2';
import { FormsModule, NgForm } from '@angular/forms';
import { OpcionesPaciente } from '../../shared/interfaces/paciente/paciente-opciones.interface';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';
import { CommonModule } from '@angular/common';
import { PacienteRegistroResponse } from '../../shared/interfaces/paciente/paciente-registro-response.interface';
import { PacienteResumenComponent } from "../paciente-resumen/paciente-resumen.component";

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css'],
  imports: [FormsModule, CommonModule, PacienteResumenComponent]
})
export class RegistroPacienteComponent {
  @Output() onClose = new EventEmitter<void>(); 
  // Variables para almacenar los valores del formulario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  dni: string = '';
  correoElectronico: string = '';
  fechaNacimiento: string = '';
  genero: string = ''
  numeroTelefonico: string = '';
  direccion: string = '';
  usuarioAcceso: string = '';
  contrasenia: string = '';
  confirmarContrasenia: string = '';
  rolUsuario: string = ''

  // Datos adicionales del paciente
  numeroHistoriaClinica: string = '';
  idTipoSangre: string = '';
  alergias: string = '';
  enfermedadesPreexistentes: string = '';
  contactoEmergencia: string = '';
  numeroContactoEmergencia: string = '';
  observaciones: string = '';

  usuarioRegistrado: UsuarioRegistroResponse | null = null;  
  pacienteRegistrado: PacienteRegistroResponse | null = null;

  // Listas para los select de opciones
  tiposSangre = OpcionesPaciente.tipoSangre;
  roles = OpcionesUsuarios.roles;
  generos = OpcionesUsuarios.generos;

  constructor(
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService
  ) {}

  // Validación de contraseñas
  validarContrasenia(): boolean {
    return this.contrasenia === this.confirmarContrasenia;
  }

  // Método onSubmit que ejecuta las validaciones y el registro
  onSubmit(registroForm: NgForm): void {
    if (!this.validarContrasenia()) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    if (registroForm.invalid) {
      // Detener el envío y mostrar los errores de validación
      registroForm.form.markAllAsTouched();
      return;
    }

    // Si todo es válido, procedemos con el registro
    this.registrarUsuarioYPaciente();
  }

  // Registro del usuario y paciente
  registrarUsuarioYPaciente(): void {
    // Crear el objeto de usuario
    const usuario: UsuarioRegistroRequest = {
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      dni: parseInt(this.dni,10),
      correoElectronico: this.correoElectronico,
      fechaNacimiento: this.fechaNacimiento,
      genero: parseInt(this.genero,10),
      numeroTelefonico: this.numeroTelefonico,
      direccion: this.direccion,
      usuarioAcceso: this.usuarioAcceso,
      contrasenia: this.contrasenia,
      rolUsuario: 3,
      esAdmin: false, // Asumimos que no es admin
      usuarioCreacion: 'Sistema'
    };

    // Primero registrar al usuario
    this.usuarioService.registrarUsuario(usuario).subscribe({
      next: (usuarioResponse: UsuarioRegistroResponse) => {
        this.usuarioRegistrado = usuarioResponse;
        // Al registrar el usuario, se asigna el ID al paciente
        const paciente: PacienteRegistroRequest = {
          idUsuario: usuarioResponse.idUsuario,
          numeroHistoriaClinica: this.numeroHistoriaClinica,
          idTipoSangre: parseInt(this.idTipoSangre,10),
          alergias: this.alergias,
          enfermedadesPreexistentes: this.enfermedadesPreexistentes,
          contactoEmergencia: this.contactoEmergencia,
          numeroContactoEmergencia: this.numeroContactoEmergencia,
          observaciones: this.observaciones,
          usuarioCreacion: 'Sistema'
        };       

        // Luego registrar al paciente
        this.pacienteService.registrarPaciente(paciente).subscribe({
          next: (pacienteResponse: PacienteRegistroResponse) => {            
            Swal.fire('Éxito', 'Paciente registrado correctamente', 'success');            
            this.pacienteRegistrado = pacienteResponse;
            this.limpiarFormulario();
          },
          error: (err) => {
            console.error('Error al registrar paciente:', err);
            Swal.fire('Error', 'No se pudo registrar el paciente', 'error');
          }
        });
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
      }
    });
  }

  // Método para limpiar el formulario
  limpiarFormulario(): void {
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

    this.numeroHistoriaClinica = '';
    this.idTipoSangre = '';
    this.alergias = '';
    this.enfermedadesPreexistentes = '';
    this.contactoEmergencia = '';
    this.numeroContactoEmergencia = '';
    this.observaciones = '';
  }

  // Cancelar el formulario
  cancelar(): void {
    Swal.fire('Cancelado', 'El formulario ha sido cancelado.', 'info');
  }

  finalizarFormulario():void{
    this.onClose.emit();
  }
}
