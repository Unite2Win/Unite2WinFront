export interface Objetivo {
    id_obj?: number;
    nombre: string;
    descripcion: string;
    duracion: number;
    create_date?: Date;
    last_modified?: Date;
    delete_date?: Date;
    id_usu?: number;
    complete_date?: Date;
}
