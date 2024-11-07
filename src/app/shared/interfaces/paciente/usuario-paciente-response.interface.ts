import { PacienteRegistroResponse } from "./paciente-registro-response.interface";

export interface UsuarioPacienteResponseDto {    
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
    paciente?: PacienteRegistroResponse;
  }