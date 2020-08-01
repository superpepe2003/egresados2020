import { IUsuario } from './usuario';

export interface ICurso {

    _id: string;
    idcolegio: string;
    codigo: string;
    creadopor: string;
    nombre: string;
    colegio: string;
    temporada: string;
    estado: number;
    localidad: string;
    alumnos: IUsuario[];
    cant: number;
    tempVende: string;
}