import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitaMedicaEdicionComponent } from '../cita-medica-edicion/cita-medica-edicion.component';
import { CitaMedicaService } from '../services/cita-medica.service';
import { CitaMedicaRegistroResponse } from '../../shared/interfaces/cita-medica/citaMedica-registro-response.interface';

@Component({
  selector: 'app-cita-medica-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, CitaMedicaEdicionComponent],
  templateUrl: './cita-medica-busqueda.component.html',
  styleUrls: ['./cita-medica-busqueda.component.css']
})
export class CitaMedicaBusquedaComponent implements OnInit {
  citasMedicas: CitaMedicaRegistroResponse[] = [];
  citasFiltradas: CitaMedicaRegistroResponse[] = [];
  citaSeleccionada: CitaMedicaRegistroResponse | null = null;
  filtroBusqueda: string = '';

  constructor(private citaMedicaService: CitaMedicaService) {}

  ngOnInit(): void {
    this.cargarCitasMedicas();
  }

  cargarCitasMedicas(): void {
    this.citaMedicaService.obtenerCitasMedicas().subscribe({
      next: (citasMedicas) => {
        this.citasMedicas = citasMedicas;
        this.filtrarCitas(); // Inicializa las citas filtradas
      },
      error: (error) => {
        console.error('Error al cargar las citas médicas:', error);
      }
    });
  }

  verDetalleCita(cita: CitaMedicaRegistroResponse): void {
    this.citaSeleccionada = cita;
  }

  cerrarDetalle(): void {
    this.citaSeleccionada = null;
  }

  filtrarCitas(): void {
    const filtro = this.filtroBusqueda.toLowerCase();
    this.citasFiltradas = this.citasMedicas.filter(cita =>
      cita.codigoCitaMedica.toLowerCase().includes(filtro) ||
      cita.motivoConsulta.toLowerCase().includes(filtro) ||
      cita.fechaCita.includes(filtro)
    );
  }
}
