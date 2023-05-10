export interface Objetivo {
    id_doc: number,
    data: string,
    descripcion: string,
    extensionArchivo: string,
    create_date?: Date,
    last_modified?: Date,
    delete_date?: Date
}