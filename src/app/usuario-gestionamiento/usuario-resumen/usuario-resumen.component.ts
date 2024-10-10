import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule para DatePipe y otras funcionalidades
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';

@Component({
  selector: 'app-usuario-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-resumen.component.html',
  styleUrls: ['./usuario-resumen.component.css']
})
export class UsuarioResumenComponent {
  @Input() usuario: UsuarioRegistroResponse | null = null; 
  
  @Output() onClose = new EventEmitter<void>();
  
  finalizarFormulario(): void {
    this.onClose.emit();
  }
}