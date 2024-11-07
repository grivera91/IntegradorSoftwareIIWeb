import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioEditarComponent } from '../../usuario-gestionamiento/usuario-editar/usuario-editar.component';
import { RecepcionistaEdicionComponent } from '../recepcionista-edicion/recepcionista-edicion.component';
import { UsuarioService } from '../../usuario-gestionamiento/services/usuario.service';
import { UsuarioRecepcionisaResponseDto } from '../../shared/interfaces/recepcionista/usuario-recepcionista-response.interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-recepcionista-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, UsuarioEditarComponent, RecepcionistaEdicionComponent],
  templateUrl: './recepcionista-busqueda.component.html',
  styleUrl: './recepcionista-busqueda.component.css'
})
export class RecepcionistaBusquedaComponent implements OnInit{

  usuarioRecepcionista: Array<UsuarioRecepcionisaResponseDto & { registrado: boolean }> = []; 
  usuarioRecepcionistaFiltrados: Array<UsuarioRecepcionisaResponseDto & { registrado: boolean }> = []; 
  usuarioRecepcionistaSeleccionado: UsuarioRecepcionisaResponseDto | null = null;
  mode: 'create' | 'edit' = 'create';  // Define el modo inicial
  filtroBusqueda: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRecepcionistas();
  }

  cargarRecepcionistas():void{
    this.usuarioService.obtenerUsuariosRecepcionistas().subscribe({
      next: (usuarioRecepcionistas) => {
        console.log(usuarioRecepcionistas);
        this.usuarioRecepcionista = usuarioRecepcionistas.map(usuarioRecepcionista => ({
          ...usuarioRecepcionista,
          registrado: !!usuarioRecepcionista.recepcionista  // true si tiene un objeto `medico`
        }));
        this.filtrarRecepcionistas();
        this.cdr.markForCheck(); // Fuerza la detección de cambios
      },
      error: (error) => {
        console.error('Error al cargar los usuarios con médicos:', error);
      }
    });
  }

  editarMedico(usuarioRecepcionista: UsuarioRecepcionisaResponseDto): void {
    this.usuarioRecepcionistaSeleccionado = usuarioRecepcionista;
    this.mode = 'edit';  // Cambia el modo a edición
  }

  completarRegistroMedico(idUsuario: number): void {
    this.usuarioRecepcionistaSeleccionado = this.usuarioRecepcionista.find(um => um.idUsuario === idUsuario) as UsuarioRecepcionisaResponseDto;
    this.mode = 'create';  // Cambia el modo a creación
  }

  cerrarEdicion(): void {
    this.usuarioRecepcionistaSeleccionado = null;
    this.cargarRecepcionistas(); // Recarga la lista al cerrar la edición
  }

  trackByUsuarioRecepcionista(index: number, item: UsuarioRecepcionisaResponseDto): number {
    return item.idUsuario;
  }

  filtrarRecepcionistas(): void {
    const filtro = this.filtroBusqueda.toLowerCase();
    this.usuarioRecepcionistaFiltrados = this.usuarioRecepcionista.filter(recepcionista => {
      const nombreCompleto = `${recepcionista.nombre} ${recepcionista.apellidoPaterno} ${recepcionista.apellidoMaterno}`.toLowerCase();
      const dni = recepcionista.dni ? recepcionista.dni.toString().toLowerCase() : '';
      return nombreCompleto.includes(filtro) || dni.includes(filtro);
    });
  }
}
