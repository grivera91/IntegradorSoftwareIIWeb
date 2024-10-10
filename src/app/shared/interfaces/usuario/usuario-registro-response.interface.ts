export interface UsuarioRegistroResponse {
    idUsuario: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    dni: number;
    correoElectronico: string;
    fechaNacimiento: string;
    genero: number;
    numeroTelefonico: string;
    direccion: string;
    usuarioAcceso: string,    
    rolUsuario: number;
    esAdmin: boolean;
    esActivo: boolean;
  }