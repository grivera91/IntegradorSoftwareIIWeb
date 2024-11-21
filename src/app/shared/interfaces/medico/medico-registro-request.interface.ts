export interface MedicoRegistroRequest{
    idMedico?: number,
    idUsuario: number,
    codigoMedico?: number,
    idEspecialidad: number,
    numeroColegiatura: string,
    observaciones: string,
    usuarioCreacion: string,
    usuarioModificacion?: string    
}