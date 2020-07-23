import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IUsuario } from '../../../models/usuario';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
})
export class AlumnosComponent implements OnInit, OnDestroy {

  @Input() alumnos: IUsuario[];
  @Input() isVendedor = false;

  subscribe: Subscription[] = [];

  constructor( private mAuth: AuthService,
               private ui: UiService) { }

  ngOnInit() {
    console.log(this.alumnos);
    console.log('Estoy');
  }

  cambiarCole( event ){
    const usuario = event.alumno;
    usuario.colegio = event.colegio._id;
    this.mAuth.updateUsuario( usuario )
            .then( user => {
                this.alumnos = this.alumnos.filter( r => r._id !== usuario._id );
                this.ui.presentToast('Alumno cambiado de colegio');
            })
            .catch( err => this.ui.mostrarError('Error', 'No se pudo cambiar de colegio'));
  }

  eliminar( id: string ) {
    this.mAuth.deleteAlumno( id )
      .then( (resp: any) => {
          this.alumnos = this.alumnos.filter( r => r._id !== id);

      })
      .catch( err => this.ui.mostrarError('Error', 'No se pudo eliminar Alumno'));
  }

  ngOnDestroy() {
    this.subscribe.forEach( resp => resp.unsubscribe() );
  }

}
