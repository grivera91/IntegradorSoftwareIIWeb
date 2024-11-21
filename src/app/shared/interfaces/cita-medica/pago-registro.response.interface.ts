export interface PagoResponse{
    idPago:number,    
    idCitaMedica:number,
    codigoPago: string,    
    idMetodoPago:number,
    importeNeto:number,
    impuestos:number,
    importeTotal:number,
    referenciaTransaccion: string,
    fechaPago: string,
    moneda: string,
    estadoPago: string,        
    observaciones: string    
}