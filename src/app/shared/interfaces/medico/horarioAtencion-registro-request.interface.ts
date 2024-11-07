export interface HorarioAtencionRegistroRequest{
    idMedico?: number,
    diaSemana: string,
    horaInicio: string,
    horaFin: string,
    usuarioCreacion: string,
    usuarioModificacion?: string,    
}