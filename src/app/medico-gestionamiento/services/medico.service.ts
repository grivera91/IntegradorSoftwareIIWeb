import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MedicoRegistroRequest } from '../../shared/interfaces/medico/medico-registro-request.interface';
import { MedicoRegistroResponse } from '../../shared/interfaces/medico/medico-registro-response.interface';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private BASE_MEDICO_URL = environment.apiUrls.medico;

  constructor(private http: HttpClient) { }

  registrarMedico(request: MedicoRegistroRequest): Observable<MedicoRegistroResponse>{
    return this.http.post<MedicoRegistroResponse>(`${this.BASE_MEDICO_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  editarMedico(idMedico: number, request: MedicoRegistroRequest): Observable<void>{
    return this.http.patch<void>(`${this.BASE_MEDICO_URL}/${idMedico}`, request)
      .pipe(catchError(this.handleError));
  }

  obtenerMedico(idMedico: number): Observable<MedicoRegistroResponse>{
    return this.http.get<MedicoRegistroResponse>(`${this.BASE_MEDICO_URL}/${idMedico}`)
      .pipe(catchError(this.handleError));
  }

  obtenerMedicos():Observable<MedicoRegistroResponse[]>{    
    let params = new HttpParams();
    return this.http.get<MedicoRegistroResponse[]>(`${this.BASE_MEDICO_URL}`, {params})
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}
