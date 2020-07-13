import { Component, OnInit, NgModule, OnDestroy, ViewChild, Input } from '@angular/core';
import { ModalController, IonSelect } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColegiosService } from '../../../services/colegios.service';
import { Subscription } from 'rxjs';
import { IColegio } from '../../../models/colegio';
import { OAuthServiceService } from '../../../services/o-auth-service.service';
import { IMarcador } from '../mapaubicar/mapa-ubicar.component';


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

  provincia = "Buenos Aires";
  provincias: any;

  marcador: IMarcador;

  ubicacion: IMarcador = {
    lat: -34.603722,
    lng: -58.381592 };

  subLocalidad: Subscription;
  subCreaCole: Subscription;
  subProvincia: Subscription;

  constructor( public modalCtrl: ModalController,
               public mCole: ColegiosService,
               private mAuth: OAuthServiceService,
               public fb: FormBuilder ) {

              }

  ngOnInit() {
    if ( this.isModificar ) {
      this.crearFormularioModificar();
      this.cargarForm();
    } else {
      this.crearFormulario();
      this.cargarForm();
    }
    this.subProvincia = this.mCole.getProvincias().subscribe( resp => {
      this.provincias = resp;
      this.cboProvi.value = 'Buenos Aires';
    });

  }

  campoNoValido( campo ){
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.fb.group({
      codigo:    ['', [ Validators.required ], !this.mCole.colegioExiste.bind(this.mCole)],
      nombre:    ['', [ Validators.required, Validators.minLength(6) ]],
      temporada: ['2022', Validators.required ],
      localidad: ['', [ Validators.required ]]
    });

  }

  crearFormularioModificar() {
    this.forma = this.fb.group({
      nombre:    ['', [ Validators.required, Validators.minLength(6) ]],
      temporada: ['2022', Validators.required ],
      localidad: ['', [ Validators.required ]]
    });

  }

  cargarForm() {
    if ( this.isModificar ){
      this.forma.reset({
        temporada: this.colegio.temporada,
        nombre: this.colegio.nombre,
        localidad: this.colegio.localidad
      });
    } else {
      this.forma.reset({
        temporada: '2022',
        codigo: 'pol22310',
        nombre: 'San Jose',
        localidad: 'Marcos Paz'
      });
    }
    //console.log(this.forma.controls);
  }

  onColegio() {

    if ( this.forma.valid ) {

      let cole: IColegio;

      cole = this.forma.value;

      cole.creadopor = this.mAuth.usuario._id;
      cole.estado = 'iniciado';
      if ( this.marcador ){
        cole.ubicacion =  { lat: this.marcador.lat, lng: this.marcador.lng};
      }

      this.subCreaCole = this.mCole.createColegio( cole )
          .subscribe( (resp: any) => {
            if ( resp.ok ){

            }
          });


    }

  }

  onColegioModificar() {
    if ( this.forma.valid ) {

      this.colegio.nombre = this.forma.get('nombre').value;
      this.colegio.temporada = this.forma.get('temporada').value;
      this.colegio.localidad = this.forma.get('localidad').value;

      this.subCreaCole = this.mCole.updateColegio( this.colegio )
          .subscribe( (resp: any) => {
            console.log(resp);
            if ( resp.ok ){
              this.modalCtrl.dismiss({
                colegio: {...this.colegio}
              });
            }
          });


    }
  }

  merror() {

  }

  UbicaLocalidad( ) {
    if (!this.isModificar){
      this.subLocalidad = this.mCole.ubicaLocalidad( this.forma.get('localidad').value )
              .subscribe( resp => {
                if ( resp ){
                   this.ubicacion = { lat: resp.lat, lng: resp.lon };
                }
              });
    }

  }


  //Evento que devuelve el componente de ubicar mapa
  ubicado( event ){
    this.marcador = { lat: event.lat, lng: event.lng };
  }

  ngOnDestroy() {
    if ( this.subLocalidad ){
      this.subLocalidad.unsubscribe();
    }
    if ( this.subProvincia ){
      this.subProvincia.unsubscribe();
    }
    if ( this.subCreaCole ) {
      this.subCreaCole.unsubscribe();
    }
  }

  salir(){
      this.modalCtrl.dismiss({
        ok: true
      });

  }

}
