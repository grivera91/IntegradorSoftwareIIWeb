export interface CitaMedicaRegistroResponse{
    idCitaMedica: number, 
    idEspecialidad: number,  
    idPaciente: number;
    idMedico: number;
    codigoCitaMedica: string,
    fechaCita: string;
    idHorario: number;    
    motivoConsulta: string;    
    estadoCita: string;

    idTipoPago: number;
    importeNeto: number;
    impuesto: number;
    importeTotal: number;
    fechaPago: string;
    moneda: string;
    codigoTranssaccion: string;
}