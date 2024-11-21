import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioEditarRequest } from '../../shared/interfaces/usuario/usuario-editar-request.interface';
import { UsuarioRegistroRequest } from '../../shared/interfaces/usuario/usuario-registro-request.interface';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';
import { environment } from '../../../environments/environment';
import { UsuarioMedicoResponseDto } from '../../shared/interfaces/medico/usuario-medico-response.interface';
import { UsuarioRecepcionisaResponseDto } from '../../shared/interfaces/recepcionista/usuario-recepcionista-response.interface';
import { PacienteUsuario } from '../../shared/interfaces/paciente/paciente-usuario-interface';
import { UsuarioPacienteResponseDto } from '../../shared/interfaces/paciente/usuario-paciente-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private BASE_USUARIO_URL = environment.apiUrls.usuario;  // Usa la variable de entorno

  constructor(private http: HttpClient) {}

  registrarUsuario(request: UsuarioRegistroRequest): Observable<UsuarioRegistroResponse> {
    return this.http.post<UsuarioRegistroResponse>(`${this.BASE_USUARIO_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  // Obtener usuarios con filtros
  obtenerUsuarios(filtroRol?: string, filtroEsAdmin?: string, busqueda?: string): Observable<UsuarioRegistroResponse[]> {
    let params = new HttpParams();
  
    if (filtroRol) {
      params = params.set('rol', filtroRol);
    }
  
    if (filtroEsAdmin) {
      params = params.set('esAdmin', filtroEsAdmin);
    }
  
    if (busqueda) {
      params = params.set('busqueda', busqueda);
    }
  
    return this.http.get<UsuarioRegistroResponse[]>(`${this.BASE_USUARIO_URL}`, { params })
      .pipe(catchError(this.handleError));
  }
  

  // Método para editar usuario usando PATCH
  editarUsuario(idUsuario: number, usuario: UsuarioEditarRequest): Observable<void> {
    return this.http.patch<void>(`${this.BASE_USUARIO_URL}/${idUsuario}`, usuario)
      .pipe(catchError(this.handleError));  // Manejar errores con el método centralizado
  }

  // Método para cambiar el estado de activación/desactivación de un usuario
  cambiarEstadoUsuario(idUsuario: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.BASE_USUARIO_URL}/cambiar-estado/${idUsuario}`, {})
      .pipe(catchError(this.handleError));
  }

  obtenerUsuario(idUsuario: number): Observable<UsuarioRegistroResponse> {
    const url = `${this.BASE_USUARIO_URL}/${idUsuario}`;
    return this.http.get<UsuarioRegistroResponse>(url);
  }

  obtenerUsuarioDni(dni: number): Observable<UsuarioRegistroResponse>{
    const url = `${this.BASE_USUARIO_URL}/dni/${dni}`;
    return this.http.get<UsuarioRegistroResponse>(url);
  }

  obtenerUsuarioRolUsuario(rolUsuario: number): Observable<UsuarioRegistroResponse[]>{
    const url = `${this.BASE_USUARIO_URL}/rolUsuario/${rolUsuario}`;
    return this.http.get<UsuarioRegistroResponse[]>(url);
  }

  obtenerUsuariosPacientes(): Observable<UsuarioPacienteResponseDto[]> {
    const url = `${this.BASE_USUARIO_URL}/usuarioPaciente`;
    return this.http.get<UsuarioPacienteResponseDto[]>(url)
      .pipe(catchError(this.handleError));
  }

  obtenerUsuariosMedicos(): Observable<UsuarioMedicoResponseDto[]> {
    const url = `${this.BASE_USUARIO_URL}/usuarioMedico`;
    return this.http.get<UsuarioMedicoResponseDto[]>(url)
      .pipe(catchError(this.handleError));
  }  

  obtenerUsuariosRecepcionistas(): Observable<UsuarioRecepcionisaResponseDto[]> {
    const url = `${this.BASE_USUARIO_URL}/usuarioRecepcionista`;
    return this.http.get<UsuarioRecepcionisaResponseDto[]>(url)
      .pipe(catchError(this.handleError));
  } 

  obtenerUsuariosMedicosEspecialidad(idEspecialidad: number): Observable<UsuarioMedicoResponseDto[]>{
    const url = `${this.BASE_USUARIO_URL}/usuarioMedicoEspecialidad/${idEspecialidad}`;
    return this.http.get<UsuarioMedicoResponseDto[]>(url)
      .pipe(catchError(this.handleError));
  }  

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}