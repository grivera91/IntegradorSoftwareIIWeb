import { HorarioAtencionRegistroRequest } from "./horarioAtencion-registro-request.interface";

export interface MedicoRegistroRequest{
    idMedico?: number,
    idUsuario: number,
    codigoMedico?: string,
    especialidad: string,
    numeroColegiatura: string,
    usuarioCreacion: string,
    usuarioModificacion?: string,
    horariosAtencion: HorarioAtencionRegistroRequest[];
}