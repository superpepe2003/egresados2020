import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IUsuario } from '../../../models/usuario';
import { GraficoAlumnoComponent } from '../grafico-alumno/grafico-alumno.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements OnInit {

  @Input() alumnos: IUsuario[];
  @Input() titulo: string;

  @ViewChild( GraficoAlumnoComponent, { static: false } ) graficosAlumno: GraficoAlumnoComponent;

  constructor( private modalCtrl: ModalController) { }

  ngOnInit() {
 
  }

  ionViewWillEnter(){
    this.graficosAlumno.cargarEstados( this.alumnos );
  }

  salir(){
    this.modalCtrl.dismiss();
  }

}
