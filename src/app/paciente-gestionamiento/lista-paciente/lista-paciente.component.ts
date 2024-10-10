import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { PacienteService } from '../services/paciente.service';
import { PacienteRegistroResponse } from '../../shared/interfaces/paciente/paciente-registro-response.interface';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioEditarComponent } from '../../usuario-gestionamiento/usuario-editar/usuario-editar.component';
import { OpcionesPaciente } from '../../shared/interfaces/paciente/paciente-opciones.interface';
import Swal from 'sweetalert2';
import { PacienteUsuario } from '../../shared/interfaces/paciente/paciente-usuario-interface';
import { PacienteEditarComponent } from "../paciente-editar/paciente-editar.component";

@Component({
  selector: 'app-lista-paciente',
  templateUrl: './lista-paciente.component.html',
  styleUrls: ['./lista-paciente.component.css'],
  imports: [FormsModule, CommonModule, UsuarioEditarComponent, PacienteEditarComponent],  
  standalone: true
})
export class ListaPacienteComponent implements OnInit {
  pacienteUsuario: PacienteUsuario[] = [];
  pacienteUsuarioFiltrados: PacienteUsuario[] = [];
  pacienteUsuarioSeleccionado: PacienteUsuario | null = null;
  filtroBusqueda: string = '';  // Filtro para búsqueda por nombre o apellidos


  tipoSangre = OpcionesPaciente.tipoSangre;
  constructor(private usuarioService: UsuarioService, private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        // Llamadas simultáneas para obtener los datos de usuario
        const usuariosObservables = pacientes.map(paciente =>
          this.usuarioService.obtenerUsuario(paciente.idUsuario)
        );

        forkJoin(usuariosObservables).subscribe({
          next: (usuarios: UsuarioRegistroResponse[]) => {
            // Combina los datos de usuarios con los de pacientes en la nueva interfaz PacienteUsuario
            this.pacienteUsuario = pacientes.map((paciente, index) => ({
              paciente,
              usuario: usuarios[index]  // Agregamos la información de usuario
            }));
            this.filtrarPacientes();  // Inicializa los pacientes filtrados
          },
          error: (error) => {
            console.error('Error al obtener los datos de los usuarios:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar los pacientes:', error);
      }
    });
  }

  // Método para filtrar los pacientes por nombre o apellidos del usuario
  filtrarPacientes(): void {
    this.pacienteUsuarioFiltrados = this.pacienteUsuario.filter(paciente => {
      // Crear una cadena con el nombre completo del usuario
      const nombreCompleto = `${paciente.usuario?.nombre} ${paciente.usuario?.apellidoPaterno} ${paciente.usuario?.apellidoMaterno}`.toLowerCase();
  
      // Convertir el DNI a cadena si está definido
      const dni = paciente.usuario?.dni ? paciente.usuario.dni.toString().toLowerCase() : '';
  
      // Verificar si la búsqueda coincide con el nombre completo o el DNI
      return nombreCompleto.includes(this.filtroBusqueda.toLowerCase()) || dni.includes(this.filtroBusqueda.toLowerCase());
    });
  }
  

  // Método para obtener el tipo de sangre en formato de texto
  obtenerTipoSangre(idTipoSangre: number): string {
    const tiposSangre = this.tipoSangre.find(ts => ts.id === idTipoSangre);    
    return tiposSangre ? tiposSangre.nombre : 'Desconocido';
  }

  editarPaciente(paciente: PacienteUsuario): void {
    this.pacienteUsuarioSeleccionado = paciente;
  }

  cerrarEdicion(): void {
    this.pacienteUsuarioSeleccionado = null;
    this.cargarPacientes();
  }

  cambiarEstadoUsuario(idUsuario: number): void {
    const usuario = this.pacienteUsuario.find(pu => pu.usuario.idUsuario === idUsuario)?.usuario;

    Swal.fire({
      title: `¿Estás seguro de que quieres ${usuario?.esActivo ? 'desactivar' : 'activar'} este usuario?`,
      text: `El usuario será ${usuario?.esActivo ? 'desactivado' : 'activado'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${usuario?.esActivo ? 'desactivar' : 'activar'}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.cambiarEstadoUsuario(idUsuario).subscribe({
          next: (response) => {
            Swal.fire({
              title: '¡Hecho!',
              text: `El usuario ha sido ${usuario?.esActivo ? 'desactivado' : 'activado'} con éxito.`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });

            this.cargarPacientes();  // Recargar la lista de usuarios después del cambio de estado
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al cambiar el estado del usuario. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }  
}
