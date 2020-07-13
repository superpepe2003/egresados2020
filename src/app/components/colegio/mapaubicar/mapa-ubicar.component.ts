import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IColegio } from '../../../models/colegio';

export interface IMarcador{
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-mapa-ubicar',
  templateUrl: './mapa-ubicar.component.html',
  styleUrls: ['./mapa-ubicar.component.scss'],
})
export class MapaUbicarComponent implements OnInit {

  @Input() ubicacion = { lat: -34.603722, lng: -58.381592};
  @Input() nombre = '';
  @Input() isTodos;
  @Input() colegios;

  @Output() ubicado = new EventEmitter<IMarcador>();

  marcador: IMarcador;

  constructor() { }

  ngOnInit() {}

  crearMarcador( event ){
    this.marcador = { lat: event.coords.lat, lng: event.coords.lng};

    this.ubicado.emit(this.marcador);

  }

}
