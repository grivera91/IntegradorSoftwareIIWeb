import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CitaMedicaService } from '../services/cita-medica.service';
import { CitaMedicaRegistroRequest } from '../../shared/interfaces/cita-medica/citaMedica-registro-request.interface';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-medica-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cita-medica-registro.component.html',
  styleUrls: ['./cita-medica-registro.component.css']
})
export class CitaMedicaRegistroComponent implements OnInit {
  citaForm: FormGroup;
  pacientes: { id: number, nombre: string }[] = [];
  medicos: { id: number, nombre: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private citaMedicaService: CitaMedicaService,
    private usuarioService: UsuarioService    
  ) {
    this.citaForm = this.fb.group({
      idPaciente: [null, Validators.required],
      idMedico: [null, Validators.required],
      fechaCita: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.maxLength(255)]],
      usuarioCreacion: ['admin']
    }, { validators: this.horaInicioMenorQueHoraFin });
  }

  predefinedHours: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarMedicos();
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
  
  registrarCita() {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      return;
    }

    const cita: CitaMedicaRegistroRequest = {
      ...this.citaForm.value,
      horaInicio: this.formatTime(this.citaForm.value.horaInicio, true),
      horaFin: this.formatTime(this.citaForm.value.horaFin, true)
    };
    console.log(cita);
    this.citaMedicaService.registrarCitaMedica(cita).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          title: 'Cita Registrada',
          text: 'La cita médica ha sido registrada exitosamente.'
        });
        this.citaForm.reset();
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar la cita. Intente nuevamente.'
        });
      }
    });
  }

  private formatTime(time: string | any, withSeconds: boolean = false): string {
    if (typeof time === 'string' && time.includes(':')) {
      const formattedTime = time.slice(0, 5);
      return withSeconds ? `${formattedTime}:00` : formattedTime;
    }
    return withSeconds ? '00:00:00' : '00:00';
  }

  private horaInicioMenorQueHoraFin(control: AbstractControl): ValidationErrors | null {
    const horaInicio = control.get('horaInicio')?.value;
    const horaFin = control.get('horaFin')?.value;

    if (horaInicio && horaFin && horaInicio >= horaFin) {
      return { horaInicioMayorQueHoraFin: true };
    }
    return null;
  }
}
