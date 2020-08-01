import { Pipe, PipeTransform } from '@angular/core';
import { IColegio } from '../models/colegio';

@Pipe({
  name: 'filtroColegios'
})
export class FiltroColegiosPipe implements PipeTransform {

  transform(cole: IColegio[], filtro: string, f = false): IColegio[] {

    if ( !cole ){
      return null;
    }

    if ( filtro.length === 0) {
      return cole;
    }

    if ( f ){
      return cole.filter( resp => {
        if ( resp.nombre.toLowerCase().includes(filtro.toLowerCase())) {

          return resp;

        }
      });
    } else {
      return cole.filter( resp => {
        if ( resp.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            resp.localidad.toLowerCase().includes(filtro.toLowerCase())){

              return resp;

        }
      });
    }

  }

}
