import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IUsuario } from '../../../models/usuario';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss'],
})
export class AlumnoComponent implements OnInit {

  @Input() alumno: IUsuario;
  @Output() cambiarCole = new EventEmitter();
  @Output() eliminar = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onCambiaCole() {

    //this.cambiarCole.emit( this.alumno );
  }

  onEliminar() {
    console.log('Elimina alumno');
    this.eliminar.emit( this.alumno._id );
  }

}
