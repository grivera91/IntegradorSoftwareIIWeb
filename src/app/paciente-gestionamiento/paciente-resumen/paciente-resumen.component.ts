import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';
import { PacienteRegistroResponse } from '../../shared/interfaces/paciente/paciente-registro-response.interface';
import { CommonModule } from '@angular/common';
import { OpcionesPaciente } from '../../shared/interfaces/paciente/paciente-opciones.interface';
import { FormsModule } from '@angular/forms';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';

@Component({
  selector: 'app-paciente-resumen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-resumen.component.html',
  styleUrl: './paciente-resumen.component.css'
})
export class PacienteResumenComponent {
  @Input() usuario: UsuarioRegistroResponse | null = null;
  @Input() paciente: PacienteRegistroResponse | null = null;

  @Output() onClose = new EventEmitter<void>();

  tipoSangre = OpcionesPaciente.tipoSangre;
  generos = OpcionesUsuarios.generos;  

  finalizarFormulario(): void {
    this.onClose.emit();
  }
}
