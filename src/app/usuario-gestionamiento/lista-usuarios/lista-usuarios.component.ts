import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioEditarComponent } from '../usuario-editar/usuario-editar.component';
import { OpcionesUsuarios } from '../../shared/interfaces/usuario/usaurio-opciones.interface';  // Importa las opciones centralizadas
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';  
import Swal from 'sweetalert2';
import { UsuarioRegistroResponse } from '../../shared/interfaces/usuario/usuario-registro-response.interface';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, UsuarioEditarComponent]
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: UsuarioRegistroResponse[] = [];
  usuariosFiltrados: UsuarioRegistroResponse[] = [];
  usuarioSeleccionado: UsuarioRegistroResponse | null = null;
  mensaje: string | null = null;

  // Filtros
  filtroRol: string = '';
  filtroEsAdmin: string = '';
  filtroBusqueda: string = '';  // Nuevo campo para búsqueda por nombre o apellidos

  // Usar las listas centralizadas
  roles = OpcionesUsuarios.roles;
  generos = OpcionesUsuarios.generos;
  tipoUsuarios = OpcionesUsuarios.tipoUsuarios;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.filtrarUsuarios();  // Inicializar los usuarios filtrados
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    });
  }

  // Método para filtrar los usuarios por rol, admin y búsqueda por nombre
  filtrarUsuarios(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const coincideRol = this.filtroRol ? usuario.rolUsuario?.toString() === this.filtroRol : true;
      // const coincideAdmin = this.filtroEsAdmin ? usuario.esAdmin.toString() === this.filtroEsAdmin : true;
      const coincideAdmin = this.filtroEsAdmin !== ''
      ? usuario.esAdmin === (this.filtroEsAdmin === '1')
      : true;
      const coincideBusqueda = this.filtroBusqueda
        ? usuario.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
          usuario.apellidoPaterno.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
          usuario.apellidoMaterno.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
        : true;

      return coincideRol && coincideAdmin && coincideBusqueda;
    });
  }

  // Función para obtener el nombre del rol según el ID
  obtenerNombreRol(rolId: number | null | undefined): string {
    // Si rolId es null o undefined, retornar 'Paciente'
    if (rolId === null || rolId === undefined) {
      return 'Paciente';
    }
    
    // Buscar el nombre del rol en la lista de roles
    const rol = this.roles.find(r => r.id === rolId);
    
    // Si se encuentra el rol, retornar su nombre; si no, retornar 'Desconocido'
    return rol ? rol.nombre : 'Desconocido';
  }  

  editarUsuario(usuario: UsuarioRegistroResponse): void {
    this.usuarioSeleccionado = usuario;
  }

  cerrarEdicion(): void {
    this.usuarioSeleccionado = null;
    this.cargarUsuarios();
  }

  cambiarEstadoUsuario(idUsuario: number): void {
    const usuario = this.usuarios.find(u => u.idUsuario === idUsuario);
  
    // Mostrar alerta de confirmación antes de proceder
    Swal.fire({
      title: `¿Estás seguro de que quieres ${usuario?.esActivo ? 'desactivar' : 'activar'} este usuario?`,
      text: `El usuario será ${usuario?.esActivo ? 'desactivado' : 'activado'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${usuario?.esActivo ? 'desactivar' : 'activar'}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, procede con el cambio de estado
        this.usuarioService.cambiarEstadoUsuario(idUsuario).subscribe({
          next: (response) => {
            // Mensaje de éxito con SweetAlert2
            Swal.fire({
              title: '¡Hecho!',
              text: `El usuario ha sido ${usuario?.esActivo ? 'desactivado' : 'activado'} con éxito.`,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
  
            this.cargarUsuarios();  // Recargar la lista de usuarios después del cambio de estado
          },
          error: (error) => {
            // Mensaje de error con SweetAlert2
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al cambiar el estado del usuario. Intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }  
}
