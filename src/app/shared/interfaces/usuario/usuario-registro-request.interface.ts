export interface UsuarioRegistroRequest {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    dni: number;
    correoElectronico: string;
    fechaNacimiento: string;
    genero: number;
    numeroTelefonico: string;
    direccion: string;
    usuarioAcceso?: string,
    contrasenia: string;
    rolUsuario?: number;
    esAdmin: boolean;
    usuarioCreacion: string;
  }
  