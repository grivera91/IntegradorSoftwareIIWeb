export interface CitaMedicaRegistroRequest{
    idEspecialidad: number;
    idPaciente: number;
    idMedico: number;
    fechaCita: string;
    idHorario: number;
    motivoConsulta: string;
    idTipoPago: number;
    importeTotal: number;
    usuarioCreacion: string;
    usuarioModificacion?: string; 
}