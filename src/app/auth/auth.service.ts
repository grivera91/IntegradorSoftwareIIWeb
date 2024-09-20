import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Esto asegura que el servicio sea inyectado a nivel global
})
export class AuthService {
  private apiUrl = 'http://3.90.21.76:5000/api/authentication/login';  // Cambia esta URL por la de tu API

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasenia: string): Observable<any> {
    return this.http.post(this.apiUrl, { usuario, contrasenia });
  }
}
