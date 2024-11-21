import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PagoRequest } from '../../shared/interfaces/cita-medica/pago-registro-request.interface';
import { PagoResponse } from '../../shared/interfaces/cita-medica/pago-registro.response.interface';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private BASE_PAGO_URL = environment.apiUrls.pago;

  constructor(private http: HttpClient) { }

  registrarPago(request: PagoRequest): Observable<PagoResponse>{
    return this.http.post<PagoResponse>(`${this.BASE_PAGO_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  obtenerPago(idPago: number):Observable<PagoResponse>{
    let params = new HttpParams();
    return this.http.get<PagoResponse>(`${this.BASE_PAGO_URL}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido'; // Mensaje por defecto
  
    if (error.error instanceof ErrorEvent) {
      // Error del cliente o de red
      errorMessage = `Error de red o cliente: ${error.error.message}`;
    } else {
      // Error del backend
      if (typeof error.error === 'string') {
        // El backend envió un mensaje de error en texto plano
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        // El backend envió un mensaje estructurado
        errorMessage = error.error.message;
      } else {
        // Otros errores (sin mensaje específico)
        errorMessage = `Error del servidor: Código ${error.status}`;
      }
    }
  
    console.error('Error capturado:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
