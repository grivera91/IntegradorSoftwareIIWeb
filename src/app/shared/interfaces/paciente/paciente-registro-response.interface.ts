export interface PacienteRegistroResponse{
    idPaciente: number,
    idUsuario: number,
    codigoPaciente: string,   
    codigoHistoriaClinica: string,
    idTipoSangre: number,
    alergias: string,
    enfermedadesPreexistentes: string,
    contactoEmergencia: string,
    numeroContactoEmergencia: string,
    observaciones: string    
}