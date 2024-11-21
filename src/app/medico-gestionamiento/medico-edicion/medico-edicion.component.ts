import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioMedicoResponseDto } from '../../shared/interfaces/medico/usuario-medico-response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicoService } from '../services/medico.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicoRegistroRequest } from '../../shared/interfaces/medico/medico-registro-request.interface';
import Swal from 'sweetalert2';
import { ParametroService } from '../../shared/services/parametro.service';
import { Especialidad } from '../../shared/interfaces/parametro/especialidad.interface';

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
  especialidades: Especialidad[] = [];
  
  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private parametroService: ParametroService
  ) {}

  ngOnInit(): void {    
    this.medicoForm = this.fb.group({
      idUsuario: [this.usuarioMedico.idUsuario, Validators.required],
      idEspecialidad: ['', Validators.required],
      numeroColegiatura: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      observaciones: [''],
      usuarioCreacion: ['admin', Validators.required],
      usuarioModificacion: ['']      
    });
  
    if (this.mode === 'edit' && this.usuarioMedico.medico) {
      this.medicoForm.patchValue({
        idEspecialidad: this.usuarioMedico.medico.idEspecialidad,
        numeroColegiatura: this.usuarioMedico.medico.numeroColegiatura,
        observaciones: this.usuarioMedico.medico.observaciones,
        usuarioModificacion: 'admin'
      });      
    }

    // Llamar al servicio para obtener las parametros
    this.cargarParametros();
  }

  cargarParametros(): void {
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

  onSubmit(): void {
    if (this.medicoForm.invalid) {
      this.medicoForm.markAllAsTouched();
      return;
    }
  
    const medicoData: MedicoRegistroRequest = {      
      idUsuario: this.medicoForm.get('idUsuario')?.value,      
      idEspecialidad: this.medicoForm.get('idEspecialidad')?.value,
      numeroColegiatura: this.medicoForm.get('numeroColegiatura')?.value,
      observaciones: this.medicoForm.get('observaciones')?.value,
      usuarioCreacion: this.medicoForm.get('usuarioCreacion')?.value,
      usuarioModificacion: this.medicoForm.get('usuarioModificacion')?.value || 'admin'      
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

  cerrarFormulario(): void {
    this.onClose.emit();
  }
}