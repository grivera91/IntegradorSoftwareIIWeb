import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RecepcionistaRegistroRequest } from '../../shared/interfaces/recepcionista/recepcionista-registro-request.interface';
import { RecepcionistaRegistroResponse } from '../../shared/interfaces/recepcionista/recepcionista-registro-response.interface';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecepcionistaService {

  private BASE_RECEPCIONISTA_URL = environment.apiUrls.recepcionista;

  constructor(private http: HttpClient) { }

  registrarRecepcionista(request: RecepcionistaRegistroRequest): Observable<RecepcionistaRegistroResponse>{
    return this.http.post<RecepcionistaRegistroResponse>(`${this.BASE_RECEPCIONISTA_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  editarRecepcionista(idRecepcionista: number, request: RecepcionistaRegistroRequest): Observable<void>{
    return this.http.patch<void>(`${this.BASE_RECEPCIONISTA_URL}/${idRecepcionista}`, request)
      .pipe(catchError(this.handleError));
  }

  obtenerRecepcionista(idRecepcionista: number): Observable<RecepcionistaRegistroResponse>{
    return this.http.get<RecepcionistaRegistroResponse>(`${this.BASE_RECEPCIONISTA_URL}/${idRecepcionista}`)
      .pipe(catchError(this.handleError));
  }

  obtenerRecepcionistas():Observable<RecepcionistaRegistroResponse[]>{    
    let params = new HttpParams();
    return this.http.get<RecepcionistaRegistroResponse[]>(`${this.BASE_RECEPCIONISTA_URL}`, {params})
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}