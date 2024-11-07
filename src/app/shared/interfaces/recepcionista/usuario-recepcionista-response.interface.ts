import { RecepcionistaRegistroResponse } from "./recepcionista-registro-response.interface";

export interface UsuarioRecepcionisaResponseDto{
    idUsuario: number;    
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
    recepcionista?: RecepcionistaRegistroResponse;
}