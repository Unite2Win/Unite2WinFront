import { Comunidad } from "./comunidadModel";
import { Documento } from "./documentoModel";

export interface Evento {
    id_evento: number;
    id_com: number;
    comunidad?: Comunidad;
    titulo: string;
    descripcion?: string;
    ubicacion?: string;
    fechaInicio: Date;
    fechaFin: Date;
    imagen?: Documento;
    create_date?: Date,
    last_modified?: Date,
    delete_date?: Date,
    asistentes: number
}