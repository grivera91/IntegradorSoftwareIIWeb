import { HorarioAtencionRegistroResponse } from './horarioAtencion-registro.response.interface';
export interface MedicoRegistroResponse{
    idMedico: number,
    idUsuario: number,
    codigoMedico: string,
    especialidad: string,
    numeroColegiatura: string,    
    horariosAtencion: HorarioAtencionRegistroResponse[];
}