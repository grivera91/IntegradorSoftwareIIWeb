import { MedicoRegistroResponse } from "./medico-registro-response.interface";

export interface UsuarioMedicoResponseDto {    
    idUsuario: number;
    codigoMedico?: string,
    codigoUsuario: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    dni?: number;
    correoElectronico: string;
    fechaNacimiento?: Date;
    genero: string;
    numeroTelefonico: string;
    direccion: string;
    medico?: MedicoRegistroResponse;
  }