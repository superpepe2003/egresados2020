import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IUsuario } from '../../../models/usuario';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements OnInit {

  @Input() alumnos: IUsuario[];
  @Input() titulo: string;

  constructor( private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  salir(){
    this.modalCtrl.dismiss();
  }

}
