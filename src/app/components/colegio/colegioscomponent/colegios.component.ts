import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IColegio } from '../../../models/colegio';

@Component({
  selector: 'app-colegios-lista',
  templateUrl: './colegios.component.html',
  styleUrls: ['./colegios.component.scss'],
})
export class ColegiosComponent implements OnInit {

  @Input() colegios: IColegio[];
  @Output() coleActualiza =  new EventEmitter();

  constructor() { }

  ngOnInit() {}

  actualiza( event ) {
    this.coleActualiza.emit( event );
  }

}
