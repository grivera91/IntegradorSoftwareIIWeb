import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioRecepcionisaResponseDto } from '../../shared/interfaces/recepcionista/usuario-recepcionista-response.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecepcionistaService } from '../services/recepcionista.service';
import { RecepcionistaRegistroRequest } from '../../shared/interfaces/recepcionista/recepcionista-registro-request.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recepcionista-edicion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recepcionista-edicion.component.html',
  styleUrl: './recepcionista-edicion.component.css'
})
export class RecepcionistaEdicionComponent implements OnInit {
  @Input() usuarioRecepcionista!: UsuarioRecepcionisaResponseDto;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() onClose = new EventEmitter<void>();

  recepcionistaForm!: FormGroup;

  // Opciones para el campo de Turno
  turnos: string[] = ['Mañana', 'Tarde', 'Noche'];

  // Opciones para el campo de Departamento
  departamentos: string[] = [
    'Recepción General', 'Admisión de Pacientes', 'Área de Citas y Agendamiento',
    'Atención al Cliente', 'Caja / Pagos', 'Autorizaciones y Seguros', 
    'Recepción en Emergencias', 'Recepción en Consultorios', 
    'Recepción de Hospitalización', 'Recepción de Laboratorio', 
    'Atención Post-Cita'
  ];

  constructor(
    private fb: FormBuilder,
    private recepcionistaService: RecepcionistaService
  ) {}

  ngOnInit(): void {
    this.recepcionistaForm = this.fb.group({
      idUsuario: [this.usuarioRecepcionista.idUsuario, Validators.required],
      fechaContratacion: ['', Validators.required],
      turno: ['', Validators.required],
      departamento: ['', Validators.required],      
      esActivo: [true],
      usuarioCreacion: ['admin', Validators.required]
    });

    if (this.mode === 'edit' && this.usuarioRecepcionista.recepcionista) {
      const fechaContratacion = this.formatDate(this.usuarioRecepcionista.recepcionista.fechaContratacion);
      this.recepcionistaForm.patchValue({
        fechaContratacion,
        turno: this.usuarioRecepcionista.recepcionista.turno,
        departamento: this.usuarioRecepcionista.recepcionista.departamento,        
        esActivo: this.usuarioRecepcionista.recepcionista.esActivo,
        usuarioModificacion: 'admin'
      });
    }
  }

  onSubmit(): void {
    if (this.recepcionistaForm.invalid) {
      this.recepcionistaForm.markAllAsTouched();
      return;
    }

    const recepcionistaData: RecepcionistaRegistroRequest = this.recepcionistaForm.value as RecepcionistaRegistroRequest;

    if (this.mode === 'create') {
      this.recepcionistaService.registrarRecepcionista(recepcionistaData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Registro Exitoso',
            text: 'El recepcionista ha sido registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => this.onClose.emit());
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al registrar el recepcionista.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      const idRecepcionista = this.usuarioRecepcionista.recepcionista!.idRecepcionista;
      console.log(idRecepcionista,recepcionistaData);
      this.recepcionistaService.editarRecepcionista(idRecepcionista, recepcionistaData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Edición Exitosa',
            text: 'Los datos del recepcionista han sido actualizados correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => this.onClose.emit());
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al actualizar los datos del recepcionista.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  // Función para convertir un objeto Date al formato "YYYY-MM-DD"
  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  cerrarFormulario(): void {
    this.onClose.emit();
  }
}
