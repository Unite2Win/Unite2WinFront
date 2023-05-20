import { Usuario } from "app/interfaces/usuarioModel";


export class globales {
    public static options = {
        theme: 'light', // two possible values: light, dark
        dir: 'ltr', // two possible values: ltr, rtl
        layout: 'vertical', // two possible values: vertical, horizontal
        sidebartype: 'full', // four possible values: full, iconbar, overlay, mini-sidebar
        sidebarpos: 'fixed', // two possible values: fixed, absolute
        headerpos: 'fixed', // two possible values: fixed, absolute
        boxed: 'full', // two possible values: full, boxed
        navbarbg: 'skin6', // six possible values: skin(1/2/3/4/5/6)
        sidebarbg: 'skin5', // six possible values: skin(1/2/3/4/5/6)
        logobg: 'skin6' // six possible values: skin(1/2/3/4/5/6)
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