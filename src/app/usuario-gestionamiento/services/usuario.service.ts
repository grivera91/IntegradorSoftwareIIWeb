import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioEditarRequest } from '../../shared/interfaces/usuario/usuario-editar-request.interface';
import { UsuarioRegistroRequest } from '../../shared/interfaces/usuario/usuario-registro-request.interface';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private BASE_USUARIO_URL = environment.apiUrls.usuario;  // Usa la variable de entorno

  constructor(private http: HttpClient) {}

  registrarUsuario(request: UsuarioRegistroRequest): Observable<UsuarioRegistroResponse> {
    return this.http.post<UsuarioRegistroResponse>(`${this.BASE_USUARIO_URL}/registrar`, request)
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
  
    return this.http.get<UsuarioRegistroResponse[]>(`${this.BASE_USUARIO_URL}/listar`, { params })
      .pipe(catchError(this.handleError));
  }
  

  // Método para editar usuario usando PATCH
  editarUsuario(idUsuario: number, usuario: UsuarioEditarRequest): Observable<void> {
    return this.http.patch<void>(`${this.BASE_USUARIO_URL}/editar/${idUsuario}`, usuario)
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

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}
