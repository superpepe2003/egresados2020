import { IColegio } from './colegio';


export interface IUsuario {
    _id: string;
    email: string;
    password: string;
    img: string;
    role: string;
    estado: boolean;
    nombre: string;
    apellido: string;
    fechaNac: Date;
    tel: string;
    curCodigo: string;
    redSocial: {
        tipo: string,
        user: string
    }[];
    colegios: IColegio[];
}

