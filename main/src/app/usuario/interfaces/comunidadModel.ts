import { Documento } from "./documentoModel";

export interface Comunidad {
    id_com: number,
    nombre: string,
    descripcion: string,
    clave: string,
    create_date?: Date,
    last_modified?: Date,
    delete_date?: Date,
    bannerid_doc?: number;
    banner?: Documento,
    pictureid_doc?: number;
    picture?: Documento;
    isVisible: boolean;
    isPublica: boolean;
}