import { Component, OnInit, Input } from '@angular/core';
import { ICurso } from '../../../models/curso';

interface IEstados {
  cant: number;
  alumnos: number;
  porcentaje: number;
}

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss'],
})
export class ResumenComponent implements OnInit {

  //@Input() 

  // Listado de Cursos pasadso
  cursos: ICurso[];
  // Estados mantiene cant alum y porcentaje
  estados: IEstados[] = [];
  total = 0;


  constructor() { }

  ngOnInit() {
  }

  cargarEstados( cursos ){
    this.cursos = cursos;
    this.estados = [];
    this.total = 0;
    for ( let i = 0; i <= 5 ; i++) {
      const temporal = this.cursos.filter( r => r.estado === i);
      const temp = {} as IEstados;
      temp.cant = temporal.length;
      temp.alumnos = 0;
      temporal.forEach( a => temp.alumnos += a.cant);
      this.estados.push({...temp});
    }

    this.estados.forEach( resp => this.total += resp.alumnos);

  }





}
