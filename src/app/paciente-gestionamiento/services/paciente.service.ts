import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PacienteRegistroRequest } from '../../shared/interfaces/paciente/paciente-registro-request.interface';
import { PacienteRegistroResponse } from '../../shared/interfaces/paciente/paciente-registro-response.interface';
import { PacienteEditRequest } from '../../shared/interfaces/paciente/paciente-editar-request.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private BASE_PACIENTE_URL = environment.apiUrls.paciente;  // Usa la variable de entorno

  constructor(private http: HttpClient) {}

  registrarPaciente(request: PacienteRegistroRequest): Observable<PacienteRegistroResponse> {
    return this.http.post<PacienteRegistroResponse>(`${this.BASE_PACIENTE_URL}`, request)
      .pipe(catchError(this.handleError));
  }

  obtenerPacientes(): Observable<PacienteRegistroResponse[]> {    
    return this.http.get<PacienteRegistroResponse[]>(`${this.BASE_PACIENTE_URL}`)
      .pipe(catchError(this.handleError));
  }

  obtenerPaciente(idPaciente: number): Observable<PacienteRegistroResponse> {
    const url = `${this.BASE_PACIENTE_URL}/${idPaciente}`;
    return this.http.get<PacienteRegistroResponse>(url);
  }

  editarPaciente(idPaciente: number, paciente: PacienteEditRequest): Observable<void> {
    return this.http.patch<void>(`${this.BASE_PACIENTE_URL}/${idPaciente}`, paciente)
      .pipe(catchError(this.handleError));  // Manejar errores con el método centralizado
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error:', error.message);
    return throwError(() => error);
  }
}