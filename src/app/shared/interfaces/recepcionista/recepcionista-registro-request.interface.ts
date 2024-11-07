export interface RecepcionistaRegistroRequest{
    idUsuario: number,
    fechaContratacion: number,
    turno: string,
    departamento: string,
    telefonoEmergencia: string,    
    direccion: string,    
    esActivo: boolean,    
    usuarioCreacion?: boolean,    
    usuarioModificacion?: boolean  
}