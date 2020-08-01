import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalController, ActionSheetController, IonSelect } from '@ionic/angular';
import { ColesService } from '../../services/coles.service';
import { AuthService } from '../../services/auth.service';
import { ICurso } from '../../models/curso';
import { AgregarCursoComponent } from '../../components/curso/agregar-curso/agregar-curso.component';
import { ResumenComponent } from '../../components/curso/resumen/resumen.component';
import { AppComponent } from '../../app.component';
import { GraficoComponent } from '../../components/curso/grafico/grafico.component';


@Component({
  selector: 'app-curso',
  templateUrl: './curso.page.html',
  styleUrls: ['./curso.page.scss'],
})
export class CursoPage implements OnInit, OnDestroy {

  constructor( private mCole: ColesService,
               public mAuth: AuthService,
               private modalCtrl: ModalController,
               public actionSheetController: ActionSheetController) {

  }

  cursos: ICurso[];
  cursosFiltrados: ICurso[];
  subCursos: Subscription;
  idVendedor = '';
  compareWith: any ;
  buscar = '';


  @ViewChild('temporada', { static: false }) cboTemporada: IonSelect;
  @ViewChild('cboVendedor', { static: false }) cboVendedor: IonSelect;
  @ViewChild( ResumenComponent, { static: false }) appResumen: ResumenComponent;
  @ViewChild( GraficoComponent, { static: false }) appGrafico: GraficoComponent;


  ngOnInit(){

  }

  async ionViewWillEnter(){
  //async ngOnInit(){
    await this.cargarComboAdmin();
    this.cboTemporada.value = '2022';
    this.cargarCole();
    // this.cargarCursos();
  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  }


  async cargarComboAdmin(){
    if ( this.mAuth.usuario.role === 'ADMIN'){
      if ( this.mAuth.vendedores.length === 0) {
        this.mAuth.vendedores = await this.mAuth.getVendedores().toPromise();
      }

      this.cboVendedor.value = this.mAuth.vendedores[0]._id;
      this.idVendedor = this.mAuth.vendedores[0]._id;
      this.compareWith = this.compareWithFn;
    }
  }

  cargarCole(){
    if ( this.mAuth.usuario.role === 'ADMIN' ){
      this.mCole.getColegios();
    } else {
      this.mCole.getColegiosVendedor( this.mAuth.usuario._id );
    }
  }

  aplicaFiltro( e ){
    let filtro = '';
    if ( this.mAuth.usuario.role === 'ADMIN'){
      if ( !this.cboVendedor.value ) { return; }
      if ( !this.cboTemporada.value ) { return; }
      filtro = `${ this.cboTemporada.value }-${ this.cboVendedor.value }`;
    } else {
      if ( !this.cboTemporada.value ) { return; }
      filtro = `${ this.cboTemporada.value }-${this.mAuth.usuario._id}`;
    }
    this.cargarCursos( filtro );
  }

  async cargarCursos( filtro ){
    this.buscar = '';
    this.cursos = await this.mCole.getCursosVendedor( filtro ).toPromise();
    if ( this.mAuth.usuario.role === 'ADMIN'){
      this.appResumen.cargarEstados( this.cursos );
      this.appGrafico.cargarEstados( this.cursos );
    }
  }

  filtrar( e ) {
    this.appResumen.cargarEstados( this.cursos.filter( resp => resp.localidad.toLowerCase().includes(this.buscar.toLowerCase())));
    this.appGrafico.cargarEstados( this.cursos.filter( resp => resp.localidad.toLowerCase().includes(this.buscar.toLowerCase())));
  }


  async agregarCurso() {
    const agregaModal = await this.modalCtrl.create({
      component: AgregarCursoComponent
    });

    await agregaModal.present();

    const { data } = await agregaModal.onDidDismiss();
    if( data ){
      if ( data.cursos ){
        data.cursos.forEach( resp => this.cursos.push({ ...resp }));
      }
    }

  }


  ngOnDestroy() {
    if ( this.subCursos ) {
      this.subCursos.unsubscribe();
    }
    this.cursos = [];
  }

}

// async ubicarTodos() {
  //   const ubicarTodosModal = await this.modalCtrl.create({
  //     component: UbicarTodosComponent,
  //     componentProps: {
  //       colegios: this.colegios
  //     }
  //   });

  //   await ubicarTodosModal.present();

  // }
