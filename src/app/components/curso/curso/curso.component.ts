import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICurso } from '../../../models/curso';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { ListarComponent } from '../../alumno/listar/listar.component';
import { AgregarCursoComponent } from '../agregar-curso/agregar-curso.component';
import { PopoverComponent } from '../popover/popover.component';
import { AuthService } from '../../../services/auth.service';
import { ColesService } from '../../../services/coles.service';
import { UiService } from '../../../services/ui.service';

import * as moment from 'moment';
import { IEstadoCurso } from '../../../models/estado-curso';

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
              await this.mCole.createEstadoCurso({
                  idCurso: this.curso._id, 
                  estado: this.curso.estado,
                  fecha: moment( new Date(), 'YYYY/MM/dd').format('DD/MM/YYYY') })
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

async mostrarEstados() {
  let listaEstados: IEstadoCurso[] = [];

  await this.mCole.cargarEstadosCurso(this.curso._id).toPromise()
      .then( resp => listaEstados = resp)
      .catch( err => this.ui.presentToast('Error al cargar los estados'));

  if ( listaEstados.length > 0) {

        let mensaje = `<table class="table">
        <thead>
          <tr>
            <th scope="col">Estados</th>
            <th scope="col">Fecha</th>
          </tr>
        </thead>
        <tbody> <tr>`;

        listaEstados.map( (item) => {
            switch (item.estado){
              case 0:
                mensaje += `<td>Cargado<td>`;
                break;
              case 1:
                mensaje += `<td>Iniciado<td>`;
                break;
              case 2:
                mensaje += `<td>R. Chico<td>`;
                break;
              case 3:
                mensaje += `<td>R. Padres<td>`;
                break;
              case 4:
                mensaje += `<td>Definicion<td>`;
                break;
              case 5:
                mensaje += `<td>Cerrado<td>`;
                break;
            }
            mensaje += `<td>${item.fecha}</td></tr>`;
        });

        mensaje += `</tbody></table>`;

        const alerta = await this.mAlert.create({
          cssClass: 'customClass',
          header: 'Listado de Estado',
          message: mensaje,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        });

        await alerta.present();

    } else {
      this.ui.presentToast('Error al cargar los estados');
    }

 }


}
