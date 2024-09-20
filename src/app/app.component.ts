import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule]  // Importa RouterModule aquí para que <router-outlet> funcione
})
export class AppComponent {
  title = 'Mi Aplicación Angular';
}
