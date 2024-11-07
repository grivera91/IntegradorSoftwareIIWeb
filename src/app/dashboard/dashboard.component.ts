import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { RegisterUserComponent } from '../usuario-gestionamiento/register-user/register-user.component';
import { ListaUsuariosComponent } from '../usuario-gestionamiento/lista-usuarios/lista-usuarios.component';
import { RegistroPacienteComponent } from '../paciente-gestionamiento/registro-paciente/registro-paciente.component';
import { ListaPacienteComponent } from '../paciente-gestionamiento/lista-paciente/lista-paciente.component'; 
import { PermisosService } from '../usuario-gestionamiento/services/nivel-acceso.service';
import { AuthService } from '../auth/services/auth.service';
import { UsuarioPerfilComponent } from "../usuario-gestionamiento/usuario-perfil/usuario-perfil.component";
import { MedicoBusquedaComponent } from "../medico-gestionamiento/medico-busqueda/medico-busqueda.component"; // Asegúrate de que la ruta sea correcta
import { MedicoRegistroComponent } from '../medico-gestionamiento/medico-registro/medico-registro.component';
import { RecepcionistaBusquedaComponent } from "../recepcionista-gestionamiento/recepcionista-busqueda/recepcionista-busqueda.component";
import { CitaMedicaRegistroComponent } from "../cita-medica-gestionamiento/cita-medica-registro/cita-medica-registro.component";
import { CitaMedicaBusquedaComponent } from "../cita-medica-gestionamiento/cita-medica-busqueda/cita-medica-busqueda.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RegisterUserComponent,
    ListaUsuariosComponent,
    RegistroPacienteComponent,
    ListaPacienteComponent,
    UsuarioPerfilComponent,
    MedicoRegistroComponent,
    MedicoBusquedaComponent,
    RecepcionistaBusquedaComponent,
    CitaMedicaRegistroComponent,
    CitaMedicaBusquedaComponent
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
  perfilUsuario: string = ''; 

  formularioActivo: string = '';  // Controla el formulario que se está mostrando
  accionesDisponibles: { [key: string]: string[] } = {};  // Almacena las acciones agrupadas por categorías
  estadoColapsado: { [key: string]: boolean } = {}; // Estado de colapsado para cada categoría
  categorias: string[] = []; // Aquí guardaremos las categorías

  constructor(
    private router: Router, 
    private permisosService: PermisosService,
    private authService: AuthService // Inyectamos AuthService
  ) {}

  ngOnInit(): void {    
    const userData = this.authService.obtenerDatosUsuario();
    if (userData) {
      this.nombre = userData.nombre.split(' ')[0];
      this.apellidoPaterno = userData.apellidoPaterno;
      this.usuarioAcceso = userData.usuarioAcceso;
      this.rolUsuario = userData.rolUsuario;
      this.esAdmin = userData.esAdmin;   
      this.perfilUsuario = userData.perfilUsuario; // Asegúrate de que esto sea un string como "ADMINISTRADOR", "RECEPCIONISTA", etc.     
      
      // Obtener las acciones disponibles según el rol
      this.accionesDisponibles = this.permisosService.getAccionesDisponibles(this.perfilUsuario);      
      
      // Obtener las claves de accionesDisponibles como categorías
      this.categorias = Object.keys(this.accionesDisponibles);
  
      // Inicializar el estado de colapso de cada categoría
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
    this.authService.cerrarSesion(); // Usa el servicio de autenticación para cerrar sesión
    this.router.navigate(['/login']);
  }

  getLabelAccion(accion: string): string {
    const labels: { [key: string]: string } = {
      'registroUsuario': 'Registrar Usuario',
      'busquedaUsuarios': 'Búsqueda Usuarios',

      'registroPaciente': 'Registrar Paciente',
      'busquedaPacientes': 'Búsqueda Pacientes',
            
      'busquedaMedicos': 'Búsqueda Médicos',  

      'busquedaRecepcionistas': 'Búsqueda Recepcionistas',

      'registroCitaMedica': 'Registrar Cita Médica',
      'busquedaCitaMedica': 'Búsqueda Cita Médica',

      'perfilUsuario': 'Perfil Usuario'
    };
    return labels[accion] || accion;
  }
}
