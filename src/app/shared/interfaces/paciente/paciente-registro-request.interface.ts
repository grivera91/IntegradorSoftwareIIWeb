export interface PacienteRegistroRequest{
    idUsuario: number,
    numeroHistoriaClinica: string,
    idTipoSangre: number,
    alergias: string,
    enfermedadesPreexistentes: string,
    contactoEmergencia: string,
    numeroContactoEmergencia: string,
    observaciones: string,
    usuarioCreacion: string,
}