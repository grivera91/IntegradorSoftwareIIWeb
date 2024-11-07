import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { UsuarioService } from '../services/usuario.service';
import { PacienteService } from '../../paciente-gestionamiento/services/paciente.service';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';
import { PacienteRegistroResponse } from '../../shared/interfaces/paciente/paciente-registro-response.interface';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';
import { OpcionesPaciente } from '../../shared/interfaces/paciente/paciente-opciones.interface';

@Component({
  selector: 'app-usuario-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.css']
})
export class UsuarioPerfilComponent implements OnInit {
  
  datosUsuario: UsuarioRegistroResponse = {
    idUsuario: 0,
    codigoUsuario: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: 0,
    correoElectronico: '',
    fechaNacimiento: '',
    genero: 0,
    numeroTelefonico: '',
    direccion: '',
    esAdmin: false,
    esActivo: false
  };

  datosPaciente: PacienteRegistroResponse = {
    idPaciente: 0,
    idUsuario: 0,
    codigoPaciente: '',
    codigoHistoriaClinica: '',
    idTipoSangre: 0,
    alergias: '',
    enfermedadesPreexistentes: '',
    contactoEmergencia: '',
    numeroContactoEmergencia: '',
    observaciones: ''
  };

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.obtenerDatosUsuario();
    if (userData) {
      this.cargarDatosUsuarioYPaciente(userData.idUsuario);
    }
  }

  private cargarDatosUsuarioYPaciente(idUsuario: number): void {
    this.usuarioService.obtenerUsuario(idUsuario).pipe(
      switchMap((response: UsuarioRegistroResponse) => {
        this.datosUsuario = response;
        return this.pacienteService.obtenerPaciente(response.idUsuario);
      }),
      catchError(error => {
        console.error('Error al cargar datos de usuario o paciente:', error);
        return of(null); // Devolver observable vacío en caso de error
      })
    ).subscribe((pacienteResponse: PacienteRegistroResponse | null) => {
      if (pacienteResponse) {
        this.datosPaciente = pacienteResponse;
      }
    });
  }

  // Nueva función para obtener el nombre del género
  obtenerNombreGenero(idGenero: number): string {
    const genero = OpcionesUsuarios.generos.find(g => g.id === idGenero);
    return genero ? genero.nombre : 'Desconocido';
  }

  obtenerTipoSangre(idTipoSangre: number): string {
    const tipoSangre = OpcionesPaciente.tipoSangre.find(tg => tg.id === idTipoSangre);
    return tipoSangre ? tipoSangre.nombre : 'Desconocido';
  }
}
