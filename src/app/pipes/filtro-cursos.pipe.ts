import { Pipe, PipeTransform } from '@angular/core';
import { ICurso } from '../models/curso';

@Pipe({
  name: 'filtroCursos'
})
export class FiltroCursosPipe implements PipeTransform {

  transform(cursos: ICurso[], filtro: string, f = false): ICurso[] {

    if ( !cursos ){
      return null;
    }

    if ( filtro.length === 0) {
      return cursos;
    }
    return cursos.filter( resp => resp.localidad.toLowerCase().includes(filtro.toLowerCase()));
  }

}
