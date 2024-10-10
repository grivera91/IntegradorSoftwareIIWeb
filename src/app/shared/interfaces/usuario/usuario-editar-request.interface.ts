export interface UsuarioEditarRequest {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string; // Opcional
    dni: number;
    correoElectronico: string;
    fechaNacimiento: string;
    genero: number;
    numeroTelefonico: string;
    direccion: string;    
    contrasenia?: string; // Contraseña es opcional en la edición
    rolUsuario: number;
    esAdmin: boolean;    
    usuarioModificacion: string;
  }
  