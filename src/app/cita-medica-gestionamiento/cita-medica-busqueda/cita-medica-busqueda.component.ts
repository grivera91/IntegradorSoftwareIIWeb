import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitaMedicaEdicionComponent } from '../cita-medica-edicion/cita-medica-edicion.component';
import { CitaMedicaService } from '../services/cita-medica.service';
import { CitaMedicaRegistroResponse } from '../../shared/interfaces/cita-medica/citaMedica-registro-response.interface';
import { Especialidad } from '../../shared/interfaces/parametro/especialidad.interface';
import { ParametroService } from '../../shared/services/parametro.service';
import Swal from 'sweetalert2';
import { Horario } from '../../shared/interfaces/parametro/horario.interface';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { UsuarioPacienteResponseDto } from '../../shared/interfaces/paciente/usuario-paciente-response.interface';
import { UsuarioMedicoResponseDto } from '../../shared/interfaces/medico/usuario-medico-response.interface';

@Component({
  selector: 'app-cita-medica-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, CitaMedicaEdicionComponent],
  templateUrl: './cita-medica-busqueda.component.html',
  styleUrls: ['./cita-medica-busqueda.component.css']
})
export class CitaMedicaBusquedaComponent implements OnInit {
  citasMedicas: CitaMedicaRegistroResponse[] = [];
  citasFiltradas: CitaMedicaRegistroResponse[] = [];
  citaSeleccionada: CitaMedicaRegistroResponse | null = null;

  filtroBusqueda: string = '';
  filtroEspecialidad: string = ''; // Filtro por ID de especialidad
  filtroFechaCita: string = ''; // Filtro por fecha de cita en formato YYYY-MM-DD
  filtroFechaInicio: string = ''; // Fecha de inicio del rango
  filtroFechaFin: string = ''; // Fecha de fin del rango


  pacientes: UsuarioPacienteResponseDto[] = [];
  medicos: UsuarioMedicoResponseDto[] = [];
  especialidades: Especialidad[] = [];
  horarios: Horario[] = [];
  

  constructor(
    private citaMedicaService: CitaMedicaService, 
    private parametroService: ParametroService,    
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    const hace15Dias = new Date();
    hace15Dias.setDate(hoy.getDate() - 15);

    // Formatear las fechas en formato YYYY-MM-DD
    this.filtroFechaInicio = hace15Dias.toISOString().split('T')[0];
    this.filtroFechaFin = hoy.toISOString().split('T')[0];
    
    this.cargarCitasMedicas();
    this.cargarParametros();
  }

  cargarCitasMedicas(): void {
    this.citaMedicaService.obtenerCitasMedicas().subscribe({
      next: (citasMedicas) => {
        this.citasMedicas = citasMedicas;
        this.filtrarCitas(); // Inicializa las citas filtradas
      },
      error: (error) => {
        console.error('Error al cargar las citas médicas:', error);
      }
    });
  }

  cargarParametros(){

    this.usuarioService.obtenerUsuariosPacientes().subscribe({
      next: (usuarioPacientes) => {
        this.pacientes = usuarioPacientes;
      },
      error: (error) => {
        console.error('Error al obtener pacientes', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las pacientes.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });

    this.usuarioService.obtenerUsuariosMedicos().subscribe({
      next: (usuarioMedicos) => {
        this.medicos = usuarioMedicos;
      },
      error: (error) => {
        console.error('Error al obtener medicos', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las medicos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });

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

    this.parametroService.obtenerHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
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

  verDetalleCita(cita: CitaMedicaRegistroResponse): void {
    this.citaSeleccionada = cita;
  }

  cerrarDetalle(): void {
    this.citaSeleccionada = null;
  }

  filtrarCitas(): void {
    const filtroTexto = this.filtroBusqueda.toLowerCase();
    const filtroEspecialidadId = this.filtroEspecialidad;
    const filtroFechaInicio = this.filtroFechaInicio ? new Date(this.filtroFechaInicio) : null;
    const filtroFechaFin = this.filtroFechaFin ? new Date(this.filtroFechaFin) : null;
  
    this.citasFiltradas = this.citasMedicas.filter(cita => {
      const fechaCita = new Date(cita.fechaCita);
  
      // Convertir fechas a solo año/mes/día
      const fechaCitaStr = fechaCita.toISOString().split('T')[0];
      const fechaInicioStr = filtroFechaInicio ? filtroFechaInicio.toISOString().split('T')[0] : null;
      const fechaFinStr = filtroFechaFin ? filtroFechaFin.toISOString().split('T')[0] : null;

      // Obtener descripciones de paciente y médico
      const nombrePaciente = this.obtenerDescripcionPaciente(cita.idPaciente).toLowerCase();
      const nombreMedico = this.obtenerDescripcionMedico(cita.idMedico).toLowerCase();
  
      // Filtro por texto
      const cumpleTexto =
        cita.codigoCitaMedica.toLowerCase().includes(filtroTexto) ||
        nombrePaciente.includes(filtroTexto) ||
        nombreMedico.includes(filtroTexto);
  
      // Filtro por especialidad
      const cumpleEspecialidad =
        !filtroEspecialidadId || cita.idEspecialidad.toString() === filtroEspecialidadId;
  
      // Filtro por rango de fechas (usar solo año/mes/día)
      const cumpleFecha =
        (!fechaInicioStr || fechaCitaStr >= fechaInicioStr) &&
        (!fechaFinStr || fechaCitaStr <= fechaFinStr);
  
      // Retorna true si cumple todos los filtros
      return cumpleTexto && cumpleEspecialidad && cumpleFecha;
    });
  }  

  obtenerDescripcionPaciente(idPaciente: number | null | undefined): string {
    const paciente = this.pacientes.find(e => e.paciente?.idPaciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No especificada';
  }

  obtenerDescripcionMedico(idMedico: number | null | undefined): string {
    const medico = this.medicos.find(e => e.medico?.idMedico === idMedico);
    return medico ? `${medico.nombre} ${medico.apellidoPaterno}`: 'No especificada';
  }

  obtenerDescripcionEspecialidad(idEspecialidad: number | null | undefined): string {
    const especialidad = this.especialidades.find(e => e.idEspecialidad === idEspecialidad);
    return especialidad ? especialidad.descripcionEspecialidad : 'No especificada';
  }

  obtenerDescripcionHorario(idHorario: number | null | undefined): string {
    const horario = this.horarios.find(e => e.idHorario === idHorario);
    return horario ? horario.descripcionHorario : 'No especificada';
  }
}