export interface PagoRequest{      
    idCitaMedica:number,    
    idMetodoPago:number,
    importeNeto:number,
    impuestos:number,
    importeTotal:number,
    referenciaTransaccion: string        
    observaciones: string,
    usuarioCreacion: string
}