import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { MedicoEdicionComponent } from "../medico-edicion/medico-edicion.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioEditarComponent } from '../../usuario-gestionamiento/usuario-editar/usuario-editar.component';
import { UsuarioMedicoResponseDto } from '../../shared/interfaces/medico/usuario-medico-response.interface';

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

  constructor(
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
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