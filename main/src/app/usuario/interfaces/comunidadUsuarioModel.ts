import { Comunidad } from "./comunidadModel";
import { Documento } from "./documentoModel";
import { Post } from "./postModel";
import { Usuario } from "./usuarioModel";

export interface ComunidadUsuario {
    id_com_usu: number,
    id_com: number,
    comunidad?: Comunidad,
    id_usu: number,
    usuario?: Usuario,
    posts?: Post[],
    apodo: string,
    nivel: number,
    avatar?: Documento,
    tipoUsuario: number,
    create_date?: Date,
    last_modified?: Date,
    delete_date?: Date,

}