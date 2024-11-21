import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CitaMedicaService } from '../services/cita-medica.service';
import { CitaMedicaRegistroRequest } from '../../shared/interfaces/cita-medica/citaMedica-registro-request.interface';
import { CommonModule, formatDate } from '@angular/common';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import Swal from 'sweetalert2';
import { Especialidad } from '../../shared/interfaces/parametro/especialidad.interface';
import { Horario } from '../../shared/interfaces/parametro/horario.interface';
import { ParametroService } from '../../shared/services/parametro.service';
import { UsuarioPacienteResponseDto } from '../../shared/interfaces/paciente/usuario-paciente-response.interface';
import { TipoPago } from '../../shared/interfaces/parametro/tipo-pago.interface';

@Component({
  selector: 'app-cita-medica-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cita-medica-registro.component.html',
  styleUrls: ['./cita-medica-registro.component.css']
})
export class CitaMedicaRegistroComponent implements OnInit {

  @Output() onClose = new EventEmitter<void>();

  citaForm: FormGroup;   

  pacientes: { id: number, nombre: string }[] = [];
  medicos: { id: number, nombre: string }[] = [];

  especialidades: Especialidad[] = [];
  horarios: Horario[] = [];
  tipoPagos: TipoPago[] = [];

  fechaMinima: string;  
  mostrarModalTarjeta = false; // Estado del modal  
  currentYear: number = new Date().getFullYear();

  searchControl: FormControl = new FormControl('');
  filteredPacientes: UsuarioPacienteResponseDto[] = [];
  selectedPaciente: UsuarioPacienteResponseDto | null = null;

  constructor(
    private fb: FormBuilder,
    private citaMedicaService: CitaMedicaService,
    private usuarioService: UsuarioService,
    private parametroService: ParametroService
  ) {
    this.citaForm = this.fb.group({
      idEspecialidad: ['', Validators.required],
      idPaciente: ['', Validators.required],
      idMedico: ['', Validators.required],
      fechaCita: ['', Validators.required],
      idHorario: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.maxLength(255)]],
      idTipoPago:['', Validators.required],
      importeTotal: [{ value: '', disabled: true }, Validators.required], // Campo de importe total (solo lectura)
      usuarioCreacion: ['admin']
    });

    // Obtiene la fecha actual en formato 'YYYY-MM-DD'
    this.fechaMinima = formatDate(new Date(), 'yyyy-MM-dd', 'en');    
  }

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarMedicos();
    this.cargarParametros();    
  }

  cargarPacientes() {
    this.usuarioService.obtenerUsuariosPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes.map(p => ({ id: p.paciente?.idPaciente!, nombre: p.nombre }));
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
      }
    });
  }

  cargarMedicos() {
    this.usuarioService.obtenerUsuariosMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos.map(m => ({ id: m.medico?.idMedico!, nombre: m.nombre }));
      },
      error: (error) => {
        console.error('Error al cargar médicos:', error);
      }
    });
  }

  cargarParametros() {
    this.parametroService.obtenerHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
      },
      error: (error) => {
        console.error('Error al obtener horarios', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los horarios.',
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

    this.parametroService.obtenerTipoPago().subscribe({
      next: (tipoPagos) => {
        this.tipoPagos = tipoPagos;        
      },
      error: (error) => {
        console.error('Error al obtener tipo pago', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los tipos de pago.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onEspecialidadChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const idEspecialidad = Number(selectElement.value);
  
    if (idEspecialidad) {
      // Cargar médicos por especialidad
      this.usuarioService.obtenerUsuariosMedicosEspecialidad(idEspecialidad).subscribe({
        next: (medicos) => {
          this.medicos = medicos.map((m) => ({
            id: m.medico?.idMedico!,
            nombre: `${m.nombre} ${m.apellidoPaterno} ${m.apellidoMaterno}`
          }));
        },
        error: (error) => {
          console.error('Error al cargar médicos por especialidad:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar los médicos para esta especialidad.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  
      // Actualizar el importe total basado en la especialidad seleccionada
      const especialidadSeleccionada = this.especialidades.find(
        (e) => e.idEspecialidad === idEspecialidad
      );      
      
      if (especialidadSeleccionada) {        
        const precioEspecialidad = especialidadSeleccionada.precioEspecialidad;        
        this.citaForm.patchValue({          
          importeTotal: precioEspecialidad // Actualiza el campo importeTotal
        });
      }
    } else {
      // Limpia la lista de médicos si no hay especialidad seleccionada
      this.medicos = [];
      // Reinicia el campo importe total
      this.citaForm.patchValue({
        importeTotal: ''
      });
    }
  }

  onTipoPagoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const idTipoPago = Number(selectElement.value);
    
    if (idTipoPago === 2) { // Pago con tarjeta
      this.mostrarModalTarjeta = true;
    } else {
      this.mostrarModalTarjeta = false;
    }
  }

  registrarCita() {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    } 
    
    this.registrarCitaDirectamente();
  }

  registrarCitaDirectamente() {
    // Habilitar el campo importeTotal temporalmente para enviar
    this.citaForm.get('importeTotal')?.enable();

    const cita: CitaMedicaRegistroRequest = { ...this.citaForm.value };

    this.citaMedicaService.registrarCitaMedica(cita).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          title: 'Cita Registrada',
          text: 'La cita médica ha sido registrada exitosamente.'
        });
        this.citaForm.reset();
        this.cerrarFormulario();
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar cita',
          text: err.message || 'Hubo un error al registrar la cita.'
        });
      }
    });
  }

  cerrarFormulario(): void {
    this.onClose.emit();
  }  
}