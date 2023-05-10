export interface Usuarios {
    id_usu: number;
    nick: string;
    password: string;
    picture: string;
    level: number;
    active: boolean;
    last_login: Date | null;
    create_date: Date;
    last_modified: Date | null;
    delete_date: Date | null;
}
