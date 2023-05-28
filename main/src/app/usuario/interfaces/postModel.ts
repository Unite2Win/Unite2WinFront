import { ComunidadUsuario } from "./comunidadUsuarioModel";
import { Documento } from "./documentoModel";
import { Usuario } from "./usuarioModel";

export interface Post {
    id_post: number;
    id_com_usu: number;
    comunidadesUsuarios?: ComunidadUsuario;
    titulo: string;
    descripcion: string;
    imagenid_doc?: number;
    imagen?: Documento;
    likes: number;
    create_date?: string;
    last_modified?: null;
    delete_date?: null;

    // El campo usuario no está en el back, lo uso para una función especifica
    usuarioID?: number;
}