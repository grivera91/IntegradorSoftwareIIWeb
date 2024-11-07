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
  idUsuario: number = 0;
  codigoUsuario: string = '';
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

   // Variable para rastrear si el usuario ya existe
   usuarioExistente: boolean = false;   

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
    if (registroForm.invalid) {
      // Si el formulario es inválido, marca todos los campos como tocados para mostrar errores
      registroForm.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    
    // Validar contraseñas solo si el usuario es nuevo
    if (!this.usuarioExistente && !this.validarContrasenia()) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
  
    // Si todo es válido, procedemos con el registro
    this.registrarUsuarioYPaciente();
  }

  registrarUsuarioYPaciente(): void {
    // Verificar si estamos registrando un usuario existente
    if (this.usuarioExistente) {
      // Flujo para usuario existente: solo registrar el paciente     

      const usuario: UsuarioRegistroResponse ={
        idUsuario: this.idUsuario,
        codigoUsuario: this.codigoUsuario,
        nombre: this.nombre,
        apellidoPaterno: this.apellidoPaterno,
        apellidoMaterno: this.apellidoMaterno,
        dni: parseInt(this.dni, 10),
        correoElectronico: this.correoElectronico,
        fechaNacimiento: this.fechaNacimiento,
        genero: parseInt(this.genero, 10),
        numeroTelefonico: this.numeroTelefonico,
        direccion: this.direccion,        
        esAdmin: false,
        esActivo: true
      }

      this.usuarioRegistrado = usuario;

      const paciente: PacienteRegistroRequest = {
        idUsuario: this.idUsuario, // Usa el ID del usuario existente
        idTipoSangre: parseInt(this.idTipoSangre, 10),
        alergias: this.alergias,
        enfermedadesPreexistentes: this.enfermedadesPreexistentes,
        contactoEmergencia: this.contactoEmergencia,
        numeroContactoEmergencia: this.numeroContactoEmergencia,
        observaciones: this.observaciones,
        usuarioCreacion: 'Sistema'
      };
  
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
    } else {
      // Flujo para nuevo usuario y paciente
      const usuario: UsuarioRegistroRequest = {
        nombre: this.nombre,
        apellidoPaterno: this.apellidoPaterno,
        apellidoMaterno: this.apellidoMaterno,
        dni: parseInt(this.dni, 10),
        correoElectronico: this.correoElectronico,
        fechaNacimiento: this.fechaNacimiento,
        genero: parseInt(this.genero, 10),
        numeroTelefonico: this.numeroTelefonico,
        direccion: this.direccion,
        contrasenia: this.contrasenia,
        esAdmin: false, // Asumimos que no es admin
        usuarioCreacion: 'Sistema'
      };
  
      this.usuarioService.registrarUsuario(usuario).subscribe({
        next: (usuarioResponse: UsuarioRegistroResponse) => {
          this.usuarioRegistrado = usuarioResponse;
          // Al registrar el usuario, se asigna el ID al paciente
          const paciente: PacienteRegistroRequest = {
            idUsuario: usuarioResponse.idUsuario,          
            idTipoSangre: parseInt(this.idTipoSangre, 10),
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
  }
  

  // Método para limpiar el formulario
  limpiarFormulario(): void {
    this.usuarioExistente = false;

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

    this.idTipoSangre = '';
    this.alergias = '';
    this.enfermedadesPreexistentes = '';
    this.contactoEmergencia = '';
    this.numeroContactoEmergencia = '';
    this.observaciones = '';       
  }

  // Cancelar el formulario
  cancelar(): void {
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

  onDniChange(): void {
    if (this.dni.length === 8) {
      this.verificarDni();
    } else {
      // Si el DNI es menor a 8 dígitos, limpia los datos y desbloquea los campos
      this.usuarioExistente = false;
      this.limpiarFormulario();
    }
  }

  // Método para verificar el DNI
  verificarDni(): void {
    if (this.dni.length === 8 && /^\d+$/.test(this.dni)) {
      this.usuarioService.obtenerUsuarioDni(parseInt(this.dni, 10)).subscribe({
        next: (usuarioExistente: UsuarioRegistroResponse) => {
          if (usuarioExistente) {
            // Usuario encontrado, mostrar alerta y marcar como existente
            this.prellenarFormularioConUsuario(usuarioExistente);
            this.usuarioExistente = true;            
            Swal.fire('Información', 'Usuario encontrado, formulario prellenado.', 'info');
          }
        },
        error: () => {
          // Usuario no encontrado, establecer usuarioExistente en false
          this.usuarioExistente = false;
        }
      });
    }
  }

  prellenarFormularioConUsuario(usuario: UsuarioRegistroResponse): void {
    this.idUsuario = usuario.idUsuario;
    this.codigoUsuario = usuario.codigoUsuario;
    this.nombre = usuario.nombre;
    this.apellidoPaterno = usuario.apellidoPaterno;
    this.apellidoMaterno = usuario.apellidoMaterno;
    this.correoElectronico = usuario.correoElectronico;
    this.fechaNacimiento = this.formatFecha(usuario.fechaNacimiento),
    this.genero = usuario.genero.toString();
    this.numeroTelefonico = usuario.numeroTelefonico;
    this.direccion = usuario.direccion;
    
    // Deshabilitar ciertos campos si deseas que no se puedan editar
    // Puedes ajustar según los campos necesarios para el registro de paciente
  }

  // Método para formatear la fecha
  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  
}
