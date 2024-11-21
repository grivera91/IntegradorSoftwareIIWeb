import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Especialidad } from '../interfaces/parametro/especialidad.interface';
import { Horario } from '../interfaces/parametro/horario.interface';
import { TipoPago } from '../interfaces/parametro/tipo-pago.interface';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  private BASE_PARAMETRO_URL = environment.apiUrls.parametro;

  constructor(private http: HttpClient) { }

  obtenerEspecialidades():Observable<Especialidad[]>{
    return this.http.get<Especialidad[]>(`${this.BASE_PARAMETRO_URL}/especialidades`)
      .pipe(catchError(this.handleError));
  }

  obtenerHorarios():Observable<Horario[]>{
    return this.http.get<Horario[]>(`${this.BASE_PARAMETRO_URL}/horarios`)
      .pipe(catchError(this.handleError));
  }

  obtenerTipoPago():Observable<TipoPago[]>{
    return this.http.get<TipoPago[]>(`${this.BASE_PARAMETRO_URL}/tipoPago`)
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}
