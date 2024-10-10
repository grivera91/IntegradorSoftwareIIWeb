// nivel-acceso.service.ts
import { Injectable } from '@angular/core';
import { RolesUsuario } from '../../shared/enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private accionesPorRol: { [key: string]: any } = {
    [RolesUsuario.ADMINISTRADOR]: {
      Usuarios: ['registroUsuario', 'listaUsuarios'],
      Pacientes: ['registroPaciente', 'listaPacientes'],
    },
    [RolesUsuario.RECEPCIONISTA]: {
      Pacientes: ['registroPaciente','listaPacientes'],
    },
    // Otros roles según el caso
  };

  // Método que devuelve las acciones disponibles organizadas por categorías
  getAccionesDisponibles(rolUsuario: number, esAdmin: boolean): any {
    if (esAdmin && rolUsuario === RolesUsuario.ADMINISTRADOR) {
      return this.accionesPorRol[RolesUsuario.ADMINISTRADOR];
    }

    return this.accionesPorRol[rolUsuario] || {};
  }
}
