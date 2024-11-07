import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CitaMedicaRegistroResponse } from '../../shared/interfaces/cita-medica/citaMedica-registro-response.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';

@Component({
  selector: 'app-cita-medica-edicion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cita-medica-edicion.component.html',
  styleUrl: './cita-medica-edicion.component.css'
})
export class CitaMedicaEdicionComponent implements OnInit {
  @Input() citaMedica!: CitaMedicaRegistroResponse;
  @Output() onClose = new EventEmitter<void>();

  nombrePaciente: string = '';
  nombreMedico: string = '';

  constructor(        
    private usuarioService: UsuarioService    
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarMedicos();
  }

  cargarPacientes() {
    this.usuarioService.obtenerUsuariosPacientes().subscribe({
      next: (pacientes) => {
        const paciente = pacientes.find(p => p.paciente?.idPaciente === this.citaMedica.idPaciente);
        if (paciente) {
          this.nombrePaciente = `${paciente.nombre} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
      }
    });
  }

  cargarMedicos() {
    this.usuarioService.obtenerUsuariosMedicos().subscribe({
      next: (medicos) => {
        const medico = medicos.find(m => m.medico?.idMedico === this.citaMedica.idMedico);
        if (medico) {
          this.nombreMedico = `${medico.nombre} ${medico.apellidoPaterno} ${medico.apellidoMaterno}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar médicos:', error);
      }
    });
  }

  cerrarFormulario(): void {
    this.onClose.emit();
  }
}
