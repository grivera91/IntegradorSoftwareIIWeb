// permisos.service.ts
import { Injectable } from '@angular/core';
import { AccionesPorCategoria, AccionesPorRol } from '../../shared/interfaces/usuario/acciones-permisos.interface';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private accionesPorRol: AccionesPorRol = {
    ADMINISTRADOR: {
      Usuarios: ['registroUsuario', 'busquedaUsuarios'],
      Médicos: ['busquedaMedicos'],
      Pacientes: ['registroPaciente', 'busquedaPacientes'],
      Recepcionistas:['busquedaRecepcionistas'],
      CitaMedica: ['registroCitaMedica', 'busquedaCitaMedica']
    },
    RECEPCIONISTA: {
      Pacientes: ['registroPaciente', 'busquedaPacientes'],
      CitaMedica: ['registroCitaMedica', 'busquedaCitaMedica']
    },
    MEDICO: {
      Pacientes: ['busquedaPaciente'],
    },
    PACIENTE: {
      Usuario: ['perfilUsuario']        
    }
  };

  // Método que devuelve las acciones disponibles organizadas por categorías
  getAccionesDisponibles(rolUsuario: string): AccionesPorCategoria {
    return this.accionesPorRol[rolUsuario] || {};
  }
}
