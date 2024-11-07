import { UsuarioRegistroResponse } from "../usuario/usuario-registro-response.interface";
import { MedicoRegistroResponse } from "./medico-registro-response.interface";

export interface UsuarioMedico{
    usuario: UsuarioRegistroResponse;
    medico?: MedicoRegistroResponse;
}