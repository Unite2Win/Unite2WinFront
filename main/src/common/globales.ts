import { Usuario } from "app/usuario/interfaces/usuarioModel";


export class globales {
    public static options = {
        theme: 'light',
        dir: 'ltr',
        layout: 'vertical',
        sidebartype: 'full',
        sidebarpos: 'fixed',
        headerpos: 'fixed',
        boxed: 'full',
        navbarbg: 'skin6',
        sidebarbg: 'skin5',
        logobg: 'skin6'
        // idioma: 'espanol'
    };

    // public static usuarioLogueado = {
    //     id_usu: null,
    //     nick: null,
    //     password: null,
    //     name: null,
    //     surname: null,
    //     email: null,
    //     picture: null,
    //     level: null,
    //     active: null,
    //     last_login: null,
    //     create_date: null,
    //     last_modified: null,
    //     delete_date: null,
    //     perfil: null,
    //     objetivos: null,
    //     comunidadesUsuarios: null,
    // }

    public static usuarioLogueado: Usuario = {
        id_usu: 0,
        nick: "",
        password: "",
        level: 0,
        active: false,
        email: "",
        name: "",
        surname: "",
        picture: undefined
    }

}