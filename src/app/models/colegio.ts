import { IUsuario } from './usuario';

export interface IColegio {

    _id: string;
    codigo: string;
    creadopor: string;
    nombre: string;
    temporada: string;
    estado: string;
    localidad: string;
    ubicacion: { lat: number, lng: number};
    alumnos: IUsuario[];

}