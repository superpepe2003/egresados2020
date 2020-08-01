import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IUsuario } from '../../../models/usuario';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UiService } from '../../../services/ui.service';
import { ColesService } from '../../../services/coles.service';

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
               private mCole: ColesService,
               private ui: UiService) { }

  ngOnInit() {
    console.log(this.alumnos);
    console.log('Estoy');
  }

  cambiarCurso( event ){
    const usuario = event.alumno;
    const codigo = event.codigo;
    const codigoViejo = usuario.curCodigo;
    usuario.curCodigo = codigo;
    console.log(usuario);
    console.log(codigo);
    console.log(codigoViejo);

    this.mAuth.updateAlumno( usuario )
            .then( () => {
                this.mCole.updateIncrementaCurso(codigoViejo, false);
                this.mCole.updateIncrementaCurso(event.codigo, true);
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
