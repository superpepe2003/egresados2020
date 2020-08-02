import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { ICurso } from '../../../models/curso';
import { IonSelect, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ColesService } from '../../../services/coles.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiService } from '../../../services/ui.service';
import { IColegio } from '../../../models/colegio';

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.scss'],
})
export class AgregarCursoComponent implements OnInit, OnDestroy {

  @Input() curso: ICurso;
  @Input() isModificar;

  cursosTemporales: ICurso[] = [];

  colegios: IColegio[];

  forma: FormGroup;

  @ViewChild('provincia', { static: true}) cboProvi: IonSelect;

  // provincia = "Buenos Aires";
  // provincias: any;

  coleFiltro = '';
  buscaCole = false;


  subcribir: Subscription [] = [];

  constructor( public modalCtrl: ModalController,
               public mCole: ColesService,
               private mAuth: AuthService,
               public fb: FormBuilder,
               private ui: UiService ) {
              }

  ngOnInit() {
    this.cambioLocalidad(null);
    if ( this.isModificar ) {
      this.crearFormularioModificar();
      this.cargarForm();
    } else {
      this.crearFormulario();
      this.cargarForm();
    }

  }


  // =========================================
  // AUTOCOMPLETE
  // =========================================

  buscar( e ) {
    this.coleFiltro = e.detail.value;
    if ( this.coleFiltro.length > 0){
      this.buscaCole = true;
    } else {
      this.buscaCole = false;
    }
  }

  elijeCole( item ){
    this.forma.controls['colegio'].setValue( item.nombre );
    this.forma.controls['localidad'].setValue( item.localidad );
    this.buscaCole = false;
  }

  cierraBlur() {
    setTimeout(() => {
      this.buscaCole = false;
    }, 50);
  }

  cambioLocalidad( e ){
    if ( !e ){ return this.colegios = this.mCole.colegios; }
    const localidad = e.detail.value;
    if ( localidad.length > 0 ){
      this.colegios = this.mCole.colegios
          .filter( resp => resp.localidad.toLowerCase() === localidad.toLowerCase());
    } else {
      this.colegios = this.mCole.colegios;
    }
  }


  // =========================================
  // FORMULARIO
  // =========================================

  campoNoValido( campo ){
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      codigo:    ['', [ Validators.required ], this.mCole.cursoNoExiste.bind(this.mCole)],
      nombre:    ['', [ Validators.required, Validators.minLength(3) ]],
      localidad:    ['', [ Validators.required ]],
      temporada: ['2022', Validators.required ],
      colegio: ['', [ Validators.required ]]
    }, { validators: this.validarColegio('colegio', 'localidad') });

  }

  crearFormularioModificar() {
    this.forma = this.fb.group({
      nombre:    ['', [ Validators.required, Validators.minLength(3) ]],
      localidad:    ['', [ Validators.required ]],
      temporada: ['2022', Validators.required ],
      colegio: ['', [ Validators.required ]]
    }, { validators: this.validarColegio('colegio', 'localidad') });
  }

  cargarForm() {
    if ( this.isModificar ){
      this.forma.reset({
        temporada: this.curso.temporada.toString(),
        nombre: this.curso.nombre,
        localidad: this.curso.localidad,
        colegio: this.curso.colegio
      });
    } else {
      this.forma.reset({
        temporada: '2022',
        colegio: '',
        localidad: '',
        nombre: ''
      });
    }
    //console.log(this.forma.controls);
  }


  // =========================================
  // GUARDADO
  // =========================================

  onCurso() {

    if ( this.forma.valid ) {

      let curso: ICurso;

      curso = this.forma.value;

      curso.creadopor = this.mAuth.usuario._id;
      curso.estado = 0;
      curso.tempVende = `${curso.temporada}-${curso.creadopor}`;
      curso.cant = 0;
      curso.codigo = curso.codigo.toLowerCase();

      this.mCole.colegios.forEach( resp => {
            if ( resp.nombre === curso.colegio && resp.localidad === curso.localidad){
                curso.idcolegio = resp._id;

                this.mCole.createCurso( curso )
                        .then( (r: any) => {
                            this.ui.mostrarInfo('curso', 'El Curso se creo correctamente');
                            this.cargarForm();
                            this.cursosTemporales.push({...curso});
                          }
                        )
                        .catch( err => this.ui.mostrarError('Curso', 'El curso no se pudo crear'));
            }
      });
    } else {
      this.ui.mostrarError('Error', 'Revise el formulario!');
    }

  }

  onCursoModificar() {
    console.log(this.forma);
    if ( this.forma.valid ) {

      let curso = {} as ICurso;

      curso = this.forma.value;

      this.curso.nombre = curso.nombre;
      this.curso.colegio = curso.colegio;
      this.curso.temporada = curso.temporada;
      this.curso.localidad = curso.localidad;
      this.curso.tempVende = `${curso.temporada}-${curso.creadopor}`;


      this.mCole.colegios.forEach( resp => {
        if ( resp.nombre === curso.colegio && resp.localidad === curso.localidad) {
          console.log('Estoy');
          curso.idcolegio = resp._id;

          this.mCole.updateCurso( curso )
          .then( (r: any) => {
              this.ui.presentToast('Los Datos fueron modificados');
              this.modalCtrl.dismiss({
                curso: {...this.curso}
              });
            })
          .catch( ex => this.ui.mostrarError('Error', 'El curso no se pudo modificar') );

        }
      });

    } else {
      this.ui.mostrarError('Error', 'Hay campos con errores');
    }
  }

  validarColegio(col, loc) {
    return ( formgroup: FormGroup) => {
      const colegio = formgroup.controls[col].value;
      const localidad = formgroup.controls[loc].value;

      if (this.isModificar) {
        if ( colegio === this.curso.colegio && localidad === this.curso.localidad){
          formgroup.controls[col].setErrors( null );
          return;
        }
      }

      const res = this.mCole.colegios.filter( resp =>
                        resp.localidad.toLowerCase() === localidad.toLowerCase() &&
                        resp.nombre.toLowerCase() === colegio.toLowerCase());

      if ( res.length > 0 ){
              formgroup.controls[col].setErrors( null );
            } else {
              formgroup.controls[col].setErrors( { noExiste: true } );
            }
    };
  }


  ngOnDestroy() {
    this.subcribir.forEach( r => r.unsubscribe() );
  }

  salir(){
      this.modalCtrl.dismiss({
        ok: true,
        cursos: this.cursosTemporales
      });

  }

}

