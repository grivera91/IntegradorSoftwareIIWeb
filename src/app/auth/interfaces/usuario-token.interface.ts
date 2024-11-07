export interface UsuarioToken {
    idUsuario: number;
    nombre: string;
    apellidoPaterno: string;
    usuarioAcceso: string;
    rolUsuario: number;
    esAdmin: boolean;
    perfilUsuario: string;
    exp?: number;
    iat?: number;
}

export function mapPayloadToUsuarioToken(payload: any): UsuarioToken {
    return {
        idUsuario: parseInt(payload.nameid, 10),
        nombre: payload.unique_name,
        apellidoPaterno: payload.ApellidoPaterno,
        usuarioAcceso: payload.UsuarioAcceso,
        rolUsuario: parseInt(payload.role, 10),
        esAdmin: payload.EsAdmin === "True",
        perfilUsuario: payload.PerfilUsuario,
        exp: payload.exp,
        iat: payload.iat
    };
}
