export interface PacienteRegistroRequest{
    idUsuario: number,    
    idTipoSangre: number,
    alergias: string,
    enfermedadesPreexistentes: string,
    contactoEmergencia: string,
    numeroContactoEmergencia: string,
    observaciones: string,
    usuarioCreacion: string,
}