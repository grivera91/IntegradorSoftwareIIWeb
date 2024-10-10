export interface PacienteEditRequest{    
    numeroHistoriaClinica: string,
    idTipoSangre: number,
    alergias: string,
    enfermedadesPreexistentes: string,
    contactoEmergencia: string,
    numeroContactoEmergencia: string,
    observaciones: string,
    usuarioModificacion: string
}