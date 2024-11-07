import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacionRequest } from '../interfaces/autenticacion-request.interface';
import { CambiarContraseniaRequest } from '../interfaces/cambiar-contrasenia.interface';
import { environment } from '../../../environments/environment';
import { AutenticacionTokenResponse } from '../interfaces/autenticacion-response-token.interface';
import { UsuarioToken, mapPayloadToUsuarioToken } from '../interfaces/usuario-token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  

  private BASE_AUTH_URL = environment.apiUrls.autenticacion;  // Usa la variable de entorno
  private usuarioData: UsuarioToken | null = null;  // Cache para almacenar los datos del usuario

  constructor(private http: HttpClient) {
    this.cargarDatosUsuario(); // Cargar datos del usuario al iniciar el servicio, si existe el token
  }
  
  login(request: AutenticacionRequest): Observable<AutenticacionTokenResponse> {
    return this.http.post<AutenticacionTokenResponse>(`${this.BASE_AUTH_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  // Método para cambio de contraseña
  cambiarContrasenia(request: CambiarContraseniaRequest): Observable<any> {
    return this.http.patch(`${this.BASE_AUTH_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  // Guardar token en sessionStorage
  guardarToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.cargarDatosUsuario(); // Cargar los datos del usuario cada vez que se guarda un nuevo token
  }

  // Obtener token desde sessionStorage
  obtenerToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Cerrar sesión eliminando el token de sessionStorage
  cerrarSesion(): void {
    sessionStorage.removeItem('token');
    this.usuarioData = null; // Limpiar cache
  }

  // Método para decodificar el token y obtener los datos del usuario
  private cargarDatosUsuario(): void {
    const token = this.obtenerToken();
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        this.usuarioData = mapPayloadToUsuarioToken(decodedPayload);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.usuarioData = null;
      }
    } else {
      this.usuarioData = null;
    }
  }

  // Método para obtener los datos del usuario
  obtenerDatosUsuario(): UsuarioToken | null {
    return this.usuarioData;
  }
  
  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}
