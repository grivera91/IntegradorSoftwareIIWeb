import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  usuario: string = '';
  contrasenia: string = '';

  constructor(private authService: AuthService) { }

  onSubmit(): void {
    this.authService.login(this.usuario, this.contrasenia).subscribe(
      response => {
        console.log('Login exitoso', response);
      },
      error => {
        console.error('Error en el login', error);
      }
    );
  }
}
