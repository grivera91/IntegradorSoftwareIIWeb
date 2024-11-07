export interface CitaMedicaRegistroRequest{
    idPaciente: number;
    idMedico: number;
    fechaCita: string; // Utiliza string para las fechas en el formato ISO
    horaInicio: string; // Utiliza string para representar TimeSpan
    horaFin: string; // Utiliza string para representar TimeSpan
    motivoConsulta: string;
    usuarioCreacion: string;
    usuarioModificacion?: string; // Campo opcional        
}