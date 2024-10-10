import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AutenticacionRequest } from '../interfaces/autenticacion-request.interface';
import { AutenticacionResponse } from '../interfaces/autenticacion-response.interface';
import { CambiarContraseniaRequest } from '../interfaces/cambiar-contrasenia.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  

  private BASE_AUTH_URL = environment.apiUrls.autenticacion;  // Usa la variable de entorno

  constructor(private http: HttpClient) {}
  
  login(request: AutenticacionRequest): Observable<AutenticacionResponse> {
    return this.http.post<AutenticacionResponse>(`${this.BASE_AUTH_URL}/login`, request)
      .pipe(catchError(this.handleError));
  }

  // Método para cambio de contraseña
  cambiarContrasenia(request: CambiarContraseniaRequest): Observable<any> {
    return this.http.post(`${this.BASE_AUTH_URL}/cambiar-contrasenia`, request)
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}
