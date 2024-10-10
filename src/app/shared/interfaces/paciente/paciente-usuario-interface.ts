import { UsuarioRegistroResponse } from "../usuario/usuario-registro-response.interface";
import { PacienteRegistroResponse } from "./paciente-registro-response.interface";

export interface PacienteUsuario {
    usuario: UsuarioRegistroResponse;
    paciente: PacienteRegistroResponse;
  }
  