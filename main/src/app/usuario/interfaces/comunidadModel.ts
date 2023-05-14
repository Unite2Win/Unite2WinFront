import { Documento } from "./documentoModel";

export interface Comunidad {
    id_com: number,
    nombre: string,
    descripcion: string,
    clave: string,
    create_date?: Date,
    last_modified?: Date,
    delete_date?: Date,
    banner: Documento,
    picture: Documento
}