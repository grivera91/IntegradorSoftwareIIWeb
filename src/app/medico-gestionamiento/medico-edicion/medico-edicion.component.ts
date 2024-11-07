import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioMedicoResponseDto } from '../../shared/interfaces/medico/usuario-medico-response.interface';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MedicoService } from '../services/medico.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicoRegistroRequest } from '../../shared/interfaces/medico/medico-registro-request.interface';
import { HorarioAtencionRegistroResponse } from '../../shared/interfaces/medico/horarioAtencion-registro.response.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-edicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medico-edicion.component.html',
  styleUrl: './medico-edicion.component.css'
})
export class MedicoEdicionComponent implements OnInit {
  @Input() usuarioMedico!: UsuarioMedicoResponseDto;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() onClose = new EventEmitter<void>();

  medicoForm!: FormGroup;

  // Array de horas predefinidas
  predefinedHours: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  // Lista de especialidades para el combo box
  especialidades: string[] = [
    'Cardiología', 'Dermatología', 'Endocrinología', 'Gastroenterología', 
    'Ginecología', 'Neurología', 'Oftalmología', 'Oncología', 
    'Pediatría', 'Psiquiatría', 'Reumatología', 'Urología'
  ];

  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    console.log(this.usuarioMedico);
    this.medicoForm = this.fb.group({
      idUsuario: [this.usuarioMedico.idUsuario, Validators.required],
      especialidad: ['', Validators.required],
      numeroColegiatura: ['', Validators.required],
      usuarioCreacion: ['admin', Validators.required],
      usuarioModificacion: [''],
      horariosAtencion: this.fb.array([])  // FormArray para los horarios
    });
  
    if (this.mode === 'edit' && this.usuarioMedico.medico) {
      this.medicoForm.patchValue({
        especialidad: this.usuarioMedico.medico.especialidad,
        numeroColegiatura: this.usuarioMedico.medico.numeroColegiatura,
        usuarioModificacion: 'admin'
      });
      this.loadHorarios(this.usuarioMedico.medico.horariosAtencion);
    }
  }  

  get horariosAtencion(): FormArray<FormGroup> {
    return this.medicoForm.get('horariosAtencion') as FormArray<FormGroup>;
  }

  private createHorarioFormGroup(): FormGroup {
    const group = this.fb.group({
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      usuarioCreacion: ['admin', Validators.required]
    }, { validators: this.horaInicioMenorQueHoraFin });

    return group;
  }

  addHorario(): void {
    this.horariosAtencion.push(this.createHorarioFormGroup());
  }

  loadHorarios(horarios: HorarioAtencionRegistroResponse[]): void {
    horarios.forEach(horario => {
      this.horariosAtencion.push(this.fb.group({
        diaSemana: [horario.diaSemana, Validators.required],
        horaInicio: [this.formatTime(horario.horaInicio), Validators.required],
        horaFin: [this.formatTime(horario.horaFin), Validators.required]
      }));
    });
  }

  removeHorario(index: number): void {
    this.horariosAtencion.removeAt(index);
  }

  onSubmit(): void {
    if (this.medicoForm.invalid) {
      this.medicoForm.markAllAsTouched();
      return;
    }
  
    const medicoData: MedicoRegistroRequest = {      
      idUsuario: this.medicoForm.get('idUsuario')?.value,      
      especialidad: this.medicoForm.get('especialidad')?.value,
      numeroColegiatura: this.medicoForm.get('numeroColegiatura')?.value,
      usuarioCreacion: this.medicoForm.get('usuarioCreacion')?.value,
      usuarioModificacion: this.medicoForm.get('usuarioModificacion')?.value || 'admin',
      horariosAtencion: this.horariosAtencion.controls.map(control => ({
        diaSemana: control.get('diaSemana')?.value,
        horaInicio: this.formatTime(control.get('horaInicio')?.value, true),
        horaFin: this.formatTime(control.get('horaFin')?.value, true),
        usuarioCreacion: control.get('usuarioCreacion')?.value || 'admin'        
      }))
    };
  
    if (this.mode === 'create') {
      this.medicoService.registrarMedico(medicoData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Registro Exitoso',
            text: 'El médico ha sido registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.onClose.emit();
          });
        },
        error: error => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar el médico. Por favor, inténtelo de nuevo.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error en el registro', error);
        }
      });
    } else {
      const idMedico = this.usuarioMedico.medico!.idMedico;
      console.log('Edicion',idMedico, medicoData)
      this.medicoService.editarMedico(idMedico, medicoData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Edición Exitosa',
            text: 'Los datos del médico han sido actualizados correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.onClose.emit();
          });
        },
        error: error => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar los datos del médico. Por favor, inténtelo de nuevo.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error en la edición', error);
        }
      });
    }
  }

  // Función unificada para formatear la hora en HH:mm o HH:mm:ss
  private formatTime(time: string | any, withSeconds: boolean = false): string {
    if (typeof time === 'string' && time.includes(':')) {
      const formattedTime = time.slice(0, 5); // Asegura formato HH:mm
      return withSeconds ? `${formattedTime}:00` : formattedTime;
    }
    return withSeconds ? '00:00:00' : '00:00';
  }

  // Validación personalizada para verificar que horaInicio sea menor que horaFin
  private horaInicioMenorQueHoraFin(control: AbstractControl): ValidationErrors | null {
    const horaInicio = control.get('horaInicio')?.value;
    const horaFin = control.get('horaFin')?.value;

    if (horaInicio && horaFin && horaInicio >= horaFin) {
      return { horaInicioMayorQueHoraFin: true };
    }
    return null;
  }

  cerrarFormulario(): void {
    this.onClose.emit();
  }
}
