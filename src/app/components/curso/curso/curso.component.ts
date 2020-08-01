import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICurso } from '../../../models/curso';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { ListarComponent } from '../../alumno/listar/listar.component';
import { AgregarCursoComponent } from '../agregar-curso/agregar-curso.component';
import { PopoverComponent } from '../popover/popover.component';
import { AuthService } from '../../../services/auth.service';
import { ColesService } from '../../../services/coles.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent implements OnInit {

  @Input() curso: ICurso;
  @Output() cursoActualiza = new EventEmitter();
  estado = '';
  estadosPosibles = ['Cargado', 'Iniciado', 'Reu Chico', 'Reu Padres', 'Definicion', 'Cerrado'];

  url = '';

  constructor( private popoverCtrl: PopoverController,
               private modal: ModalController,
               private mAlert: AlertController,
               private mAuth: AuthService,
               private mCole: ColesService,
               private ui: UiService) { }

  ngOnInit() {
    this.estado = this.estadosPosibles[this.curso.estado];
  }

  async onMenu( evento, curso) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: evento,
      mode: 'ios',
      backdropDismiss: true
    });

    await popover.present();

    // const { data } = await popover.onDidDismiss();
    const { data } = await popover.onWillDismiss();

    console.log('menu: ', data.item);
    switch ( data.item ){
      case 1:
        this.ejecutarModificar( curso );
        break;
      case 2:
        this.ejecutarLista( curso );
        break;
    }
  }

  async ejecutarLista( curso: ICurso){
    const Alumnos = await this.mAuth.getAlumnos( curso.codigo ).toPromise();
    const modalLista = await this.modal.create({
      component: ListarComponent,
      componentProps: {
        alumnos: Alumnos,
        titulo: `${curso.colegio} - ${curso.nombre}`
      }
    });


    modalLista.present();

    await modalLista.onDidDismiss();

    this.cursoActualiza.emit({ ok: true });

  }


  async ejecutarModificar( cur: ICurso){
    const modalLista = await this.modal.create({
      component: AgregarCursoComponent,
      componentProps: {
        curso: cur,
        isModificar: true
      }
    });

    modalLista.present();

    const { data } = await modalLista.onDidDismiss();

    if ( data.colegio ){
      this.curso = {...data.curso};
      console.log(this.curso);
      this.cursoActualiza.emit({ ok: true });
    }
}

async cambiarEstado(){

  if ( this.curso.estado < 5) {

      const alerta = await this.mAlert.create({
        cssClass: 'customClass',
        header: 'Cambiar Estado',
        message: `Desea avanzar 1 estado <br>
                  El estado actual es: <br>
                  <span class="span">${ this.estado }</span><br>
                  El proximo estado es: <br>
                  <span class="span">${this.estadosPosibles[ this.curso.estado + 1]}</span>`,
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              this.curso.estado = this.curso.estado + 1;
              await this.mCole.updateCurso( this.curso );
              this.estado = this.estadosPosibles[ this.curso.estado ];
              this.cursoActualiza.emit({ ok: true });
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });

      await alerta.present();

  } else {
    this.ui.presentToast('El curso no tiene mas estados posibles');
  }

}


}
