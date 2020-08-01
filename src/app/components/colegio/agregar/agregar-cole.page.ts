import { Component, OnInit, NgModule, OnDestroy, ViewChild, Input } from '@angular/core';
import { ModalController, IonSelect } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IColegio } from '../../../models/colegio';
import { UiService } from '../../../services/ui.service';
import { ColesService } from '../../../services/coles.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-agregar-cole',
  templateUrl: './agregar-cole.page.html',
  styleUrls: ['./agregar-cole.page.scss'],
})
export class AgregarColePage implements OnInit, OnDestroy {

  @Input() colegio: IColegio;
  @Input() isModificar;
  


  forma: FormGroup;

  @ViewChild('provincia', { static: true}) cboProvi: IonSelect;

  municipios: any[] = [];
  provincia = "Buenos Aires";
  provincias: any;
  muniFiltro = '';
  buscaMuni = false;


  suscribir: Subscription[] = [];

  constructor( public modalCtrl: ModalController,
               public mCole: ColesService,
               private mAuth: AuthService,
               public fb: FormBuilder,
               private ui: UiService ) {

              }

  ngOnInit() {
    if ( this.isModificar ) {
      this.crearFormularioModificar();
      this.cargarForm();
    } else {
      this.crearFormulario();
      this.cargarForm();
    }
    this.suscribir.push( this.mCole.getProvincias().subscribe( resp => {
        this.provincias = resp;
        this.cboProvi.value = 'Buenos Aires';
      })
    );

  }

  // =========================================
  // BUSCA LA LOCALIDAD POR LA PROVINCIA ELEGIDA
  // =========================================
  buscar( e ) {
    this.muniFiltro = e.detail.value;
    console.log(this.muniFiltro);
    if ( this.muniFiltro.length > 0){
      this.buscaMuni = true;
    } else {
      this.buscaMuni = false;
    }
  }

  elijeMuni( item ){
    console.log(item.nombre);
    this.forma.controls['localidad'].setValue( item.nombre );
    this.buscaMuni = false;
  }

  cierraBlur() {
    setTimeout(() => {
      this.buscaMuni = false;
    }, 50);
  }

  cambioProvincia( e ){
    this.cargarMunicipios(e.detail.value);
  }

  cargarMunicipios( provi: string ){
    this.suscribir.push(
      this.mCole.getMunicipio( provi )
          .subscribe( resp => {
            this.municipios = resp;
          }));
  }

  // =========================================
  // FORMULARIOS
  // =========================================

  campoNoValido( campo ){
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:    ['', [ Validators.required ]],
      tipo: ['privado', Validators.required ],
      localidad: ['', [ Validators.required ]],
      provincia: ['', [Validators.required]]
    }, {
      validators: this.validarColegio('nombre', 'localidad', 'provincia')
    });

  }

  crearFormularioModificar() {
    this.forma = this.fb.group({
      nombre:    ['', [ Validators.required ]],
      tipo: ['privado', Validators.required ],
      localidad: ['', [ Validators.required ]],
      provincia: ['', [Validators.required]]
    }, {
      validators: this.validarColegio('nombre', 'localidad', 'provincia')
    });

  }

  cargarForm() {
    if ( this.isModificar ){
      this.forma.reset({
        tipo: this.colegio.tipo,
        nombre: this.colegio.nombre,
        localidad: this.colegio.localidad,
        provincia: this.colegio.provincia
      });
      this.cargarMunicipios(this.colegio.provincia);
    } else {
      this.forma.reset({
        nombre: '',
        localidad: '',
        provincia: 'Buenos Aires',
        tipo: 'privado'
      });
      this.cargarMunicipios('Buenos Aires');
    }
  }

  // =========================================
  // GUARDAR
  // =========================================

  onColegio() {
    if ( this.forma.valid ) {
      let cole: IColegio;

      cole = this.forma.value;

      cole.creadopor = this.mAuth.usuario._id;
      cole.nombreLargo = cole.nombre.toLowerCase() + '-'
                          + cole.localidad.toLowerCase() + '-' + cole.provincia.toLowerCase();

      this.mCole.createColegio( cole )
            .then( (resp: any) => {
                this.ui.mostrarInfo('Colegio', 'El Colegio se creo correctamente');
                this.cargarForm();
              }
            );


    } else {
      let mensaje = 'Hay datos no validos';
      this.ui.mostrarError('Error', mensaje);
    }

  }

  onColegioModificar() {

    if ( this.forma.valid ) {

      let cole: IColegio;

      cole = this.forma.value;

      this.colegio.nombre = cole.nombre;
      this.colegio.tipo = cole.tipo;
      this.colegio.localidad = cole.localidad;
      this.colegio.provincia = cole.provincia;
      this.colegio.nombreLargo = cole.nombre.toLowerCase() + '-'
                          + cole.localidad.toLowerCase() + '-' + cole.provincia.toLowerCase();

      this.mCole.updateColegio( this.colegio )
          .then( async (resp: any) => {
              await this.mCole.updateCursos(this.colegio);
              this.ui.presentToast('Los Datos fueron modificados');
              this.modalCtrl.dismiss({
                colegio: {...this.colegio}
              });
            })
          .catch( ex => this.ui.mostrarError('Error', 'El colegio no se pudo modificar') );

    } else {
      this.ui.mostrarError('Error', 'Hay campos con errores');
    }
  }

  validarColegio(n: string, l: string, p: string) {
    return ( formgroup: FormGroup) => {
      const nombre = formgroup.controls[n].value;
      const localidad = formgroup.controls[l].value;
      const provincia = formgroup.controls[p].value;

      if ( this.isModificar ) {
        if ( nombre === this.colegio.nombre && localidad === this.colegio.localidad
             && provincia === this.colegio.provincia){
          formgroup.controls[n].setErrors( null );
          return;
        }
      }

      const res = this.mCole.colegios.filter( resp =>
                        resp.localidad.toLowerCase() === localidad.toLowerCase() &&
                        resp.nombre.toLowerCase() === nombre.toLowerCase() &&
                        resp.provincia.toLowerCase() === provincia.toLowerCase());

      if ( res.length > 0 ){
              formgroup.controls[n].setErrors( { Existe: true } );
            } else {
              formgroup.controls[n].setErrors( null );
            }
    };
  }

  ngOnDestroy() {
    this.suscribir.forEach(resp => resp.unsubscribe());
  }

  salir(){
      this.modalCtrl.dismiss({
        ok: true
      });

  }

}
