import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroMunicipio'
})
export class PipesPipe implements PipeTransform {

  transform(arreglo: any[], filtro: string) {

    filtro = filtro.toLowerCase();

    return arreglo.filter( item => {
      return item.nombre.toLowerCase().includes( filtro );
    });

  }

}
