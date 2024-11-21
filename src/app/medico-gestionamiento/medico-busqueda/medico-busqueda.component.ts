import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { MedicoEdicionComponent } from "../medico-edicion/medico-edicion.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioEditarComponent } from '../../usuario-gestionamiento/usuario-editar/usuario-editar.component';
import { UsuarioMedicoResponseDto } from '../../shared/interfaces/medico/usuario-medico-response.interface';
import { ParametroService } from '../../shared/services/parametro.service';
import { Especialidad } from '../../shared/interfaces/parametro/especialidad.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, UsuarioEditarComponent, MedicoEdicionComponent],
  templateUrl: './medico-busqueda.component.html',
  styleUrl: './medico-busqueda.component.css'
})
export class MedicoBusquedaComponent implements OnInit {

  usuarioMedico: Array<UsuarioMedicoResponseDto & { registrado: boolean }> = []; 
  usuarioMedicoFiltrados: Array<UsuarioMedicoResponseDto & { registrado: boolean }> = []; 
  usuarioMedicoSeleccionado: UsuarioMedicoResponseDto | null = null;
  mode: 'create' | 'edit' = 'create';  // Define el modo inicial
  filtroBusqueda: string = '';

  especialidades: Especialidad[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private parametroService: ParametroService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.cargarParametros();
  }

  cargarMedicos(): void {
    this.usuarioService.obtenerUsuariosMedicos().subscribe({
      next: (usuariosMedicos) => {        
        this.usuarioMedico = usuariosMedicos.map(usuarioMedico => ({
          ...usuarioMedico,
          registrado: !!usuarioMedico.medico  // true si tiene un objeto `medico`
        }));
        this.filtrarMedicos();
      },
      error: (error) => {
        console.error('Error al cargar los usuarios con médicos:', error);
      }
    });
  }

  cargarParametros(){
    this.parametroService.obtenerEspecialidades().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
      error: (error) => {
        console.error('Error al obtener especialidades', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las especialidades.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  obtenerDescripcionEspecialidad(idEspecialidad: number | null | undefined): string {
    const especialidad = this.especialidades.find(e => e.idEspecialidad === idEspecialidad);
    return especialidad ? especialidad.descripcionEspecialidad : 'No especificada';
  }
  

  editarMedico(usuarioMedico: UsuarioMedicoResponseDto): void {
    this.usuarioMedicoSeleccionado = usuarioMedico;
    this.mode = 'edit';  // Cambia el modo a edición
  }

  completarRegistroMedico(idUsuario: number): void {
    this.usuarioMedicoSeleccionado = this.usuarioMedico.find(um => um.idUsuario === idUsuario) as UsuarioMedicoResponseDto;
    this.mode = 'create';  // Cambia el modo a creación
  }

  cerrarEdicion(): void {
    this.usuarioMedicoSeleccionado = null;
    this.cargarMedicos(); // Recarga la lista al cerrar la edición
  }

  filtrarMedicos(): void {
    const filtro = this.filtroBusqueda.toLowerCase();
    this.usuarioMedicoFiltrados = this.usuarioMedico.filter(medico => {
      const nombreCompleto = `${medico.nombre} ${medico.apellidoPaterno} ${medico.apellidoMaterno}`.toLowerCase();
      const dni = medico.dni ? medico.dni.toString().toLowerCase() : '';
      return nombreCompleto.includes(filtro) || dni.includes(filtro);
    });
  }
}