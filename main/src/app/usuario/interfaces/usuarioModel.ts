import { Comunidad } from "./comunidadModel"
import { Documento } from "./documentoModel"
import { Perfil } from "./perfilModel"

// export interface Usuario {
//     id_usu: number
//     nick: string,
//     password: string,
//     name: string,
//     surname: string,
//     email: string,
//     // picture: Documento,
//     level: number,
//     active: boolean,
//     // last_login: Date,
//     // create_date: Date,
//     // last_modified: Date,
//     // delete_date: Date,
//     // perfil: Perfil,
//     // objetivos: Objetivo[],
//     // comunidadesUsuario: Comunidad[]
// }

export interface Usuario {
    id_usu?:              number;
    nick:                string;
    password:            string;
    name:                string;
    surname:             string;
    email:               string;
    picture:             Documento;
    level:               number;
    active:              boolean;
    last_login?:          null;
    create_date?:         string;
    last_modified?:       null;
    delete_date?:         null;
    perfil?:              null;
    objetivos?:           null;
    comunidadesUsuarios?: null;
}