import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UiService } from '../../../services/ui.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.scss'],
})
export class ModificarPerfilComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  subscripciones: Subscription[] = [];

  slideOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  @ViewChild( IonSlides, { static: false } ) slides: IonSlides;

  constructor( private modal: ModalController,
               private formBuilder: FormBuilder,
               public mAuth: AuthService,
               public ui: UiService) {

                this.crearFormulario();
                this.cargarForm();

  }

  ngOnInit() {}

  get redsociales() {
    return this.forma.get('redSocial') as FormArray;
  }

  campoNoValido( campo: string ) {
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      nombre: ['', [ Validators.required ]],
      apellido: ['', [ Validators.required ]],
      tel: ['', ],
      fechaNac: [''],
      redSocial: this.formBuilder.array([
          this.formBuilder.group({
            tipo: [''],
            user: ['']
          }),
          this.formBuilder.group({
            tipo: [''],
            user: ['']
          }),
          this.formBuilder.group({
            tipo: [''],
            user: ['']
          })
        ])
    });

  }

  cargarForm() {
    console.log(this.mAuth.usuario);
    this.forma.reset({
      nombre: this.mAuth.usuario.nombre,
      apellido: this.mAuth.usuario.apellido,
      fechaNac: this.mAuth.usuario.fechaNac,
      tel: this.mAuth.usuario.tel,
      redSocial: this.mAuth.usuario.redSocial
    });
    //console.log(this.forma.controls);
  }

  modificar() {
    if ( this.forma.valid ) {
      const user = {...this.mAuth.usuario};
      user.nombre = this.forma.get('nombre').value;
      user.apellido = this.forma.get('apellido').value;
      user.fechaNac = this.forma.get('fechaNac').value;
      user.tel = this.forma.get('tel').value;
      user.redSocial = this.forma.get('redSocial').value;

      user.redSocial = user.redSocial.filter( resp => resp.tipo !== null && resp.user !== null);

      this.mAuth.updateUsuario( user )
            .then( (resp: any) => {
                console.log(this.mAuth.usuario);
                this.mAuth.usuario = user;
                console.log(this.mAuth.usuario);
                this.ui.presentToast('Los Datos fueron modificados');

                this.salir();
            })
            .catch( err => {
              this.ui.mostrarError('Error', 'Error al modificar los datos');
            });
    } else {
      this.ui.mostrarError('Error', 'Hay campos con errores');
    }
  }

  siguiente() {
    console.log(this.slides);
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  atras() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  salir() {
    console.log('hola');
    this.modal.dismiss();
  }

  ngOnDestroy() {
    this.subscripciones.forEach( resp => resp.unsubscribe());
  }

}
