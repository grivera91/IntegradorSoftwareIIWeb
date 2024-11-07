export interface CitaMedicaRegistroResponse{
    idCitaMedica: number,   
    idPaciente: number;
    idMedico: number;
    codigoCitaMedica: string,
    fechaCita: string; // Utiliza string para las fechas en el formato ISO
    horaInicio: string; // Utiliza string para representar TimeSpan
    horaFin: string; // Utiliza string para representar TimeSpan
    motivoConsulta: string;    
}