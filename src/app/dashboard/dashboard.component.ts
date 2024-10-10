import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RolesUsuario } from '../shared/enums/roles.enum';
import { RegisterUserComponent } from '../usuario-gestionamiento/register-user/register-user.component';
import { ListaUsuariosComponent } from '../usuario-gestionamiento/lista-usuarios/lista-usuarios.component';
import { RegistroPacienteComponent } from '../paciente-gestionamiento/registro-paciente/registro-paciente.component';
import { ListaPacienteComponent } from '../paciente-gestionamiento/lista-paciente/lista-paciente.component'; 
import { PermisosService } from '../usuario-gestionamiento/services/nivel-acceso.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RegisterUserComponent, 
    ListaUsuariosComponent, 
    RegistroPacienteComponent, 
    ListaPacienteComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nombre: string = '';
  apellidoPaterno: string = '';
  usuarioAcceso: string = '';
  rolUsuario: number = 0;
  esAdmin: boolean = false;
  RolesUsuario = RolesUsuario;

  formularioActivo: string = '';  // Controla el formulario que se está mostrando
  accionesDisponibles: { [key: string]: string[] } = {};  // Almacena las acciones agrupadas por categorías
  estadoColapsado: { [key: string]: boolean } = {}; // Estado de colapsado para cada categoría
  categorias: string[] = []; // Aquí guardaremos las categorías

  constructor(private router: Router, private permisosService: PermisosService) {}

  ngOnInit(): void {
    const userData = this.obtenerDatosUsuario();

    if (userData) {
      this.nombre = userData.nombre.split(' ')[0];
      this.apellidoPaterno = userData.apellidoPaterno;
      this.usuarioAcceso = userData.usuarioAcceso;
      this.rolUsuario = userData.rolUsuario;
      this.esAdmin = userData.esAdmin;

      // Obtener las acciones disponibles según el rol y esAdmin
      this.accionesDisponibles = this.permisosService.getAccionesDisponibles(this.rolUsuario, this.esAdmin);
      
      // Obtener las claves de accionesDisponibles como categorías
      this.categorias = Object.keys(this.accionesDisponibles);

      // Inicializa el estado de colapso de cada categoría basada en las acciones disponibles
      for (const categoria of this.categorias) {
        this.estadoColapsado[categoria] = false;
      }
    }
  }

  // Método para abrir un formulario y alternar su visibilidad
  abrirFormulario(formulario: string): void {
    this.formularioActivo = this.formularioActivo === formulario ? '' : formulario;
  }

  // Alternar la visibilidad de las acciones dentro de una categoría
  alternarCategoria(categoria: string): void {
    this.estadoColapsado[categoria] = !this.estadoColapsado[categoria];
  }

  cerrarFormulario(): void {
    this.formularioActivo = '';  // Vacía la variable para cerrar formularios
  }

  cerrarSesion(): void {
    localStorage.clear(); // Limpiar el localStorage
    this.router.navigate(['/login']); // Redirigir a la página de login
  }

  private obtenerDatosUsuario(): any {
    const userData = localStorage.getItem('datosUsuario');
    return userData ? JSON.parse(userData) : null;
  }

  getLabelAccion(accion: string): string {
    const labels: { [key: string]: string } = {
      'registroUsuario': 'Registrar Usuario',
      'listaUsuarios': 'Listar Usuarios',
      'registroPaciente': 'Registrar Paciente',
      'listaPacientes': 'Listar Pacientes'
    };
    return labels[accion] || accion;
  }
}
