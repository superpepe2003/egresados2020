import { IUsuario } from './usuario';

export interface IColegio {

    _id: string;
    creadopor: string;
    nombre: string;
    localidad: string;
    provincia: string;
    nombreLargo: string;
    tipo: string;
    ubicacion: { lat: number, lng: number};

}