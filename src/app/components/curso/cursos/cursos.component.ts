import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICurso } from '../../../models/curso';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements OnInit {

  @Input() cursos: ICurso[];
  @Output() cursoActualiza =  new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  actualiza( event ) {
    this.cursoActualiza.emit( event );
  }
}
