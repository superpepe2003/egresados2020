import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UiService } from '../../../services/ui.service';
import { Subscription } from 'rxjs';
import { IUsuario } from '../../../models/usuario';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss'],
})
export class AgregarComponent implements OnInit {


  forma: FormGroup;

  slideOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  @ViewChild( IonSlides, { static: false } ) slides: IonSlides;

  constructor( private modal: ModalController,
               private formBuilder: FormBuilder,
               public mAuth: AuthService,
               public ui: UiService) {
            
  }

  ngOnInit() {
    this.crearFormulario();
    this.cargarForm();
  }

  get redsociales() {
    return this.forma.get('redSocial') as FormArray;
  }

  campoNoValido( campo: string ) {
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      email: ['', [ Validators.required , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,3}$') ]],
      password: ['', [ Validators.required, Validators.minLength(6) ]],
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
    this.forma.reset({
      // nombre: this.mAuth.usuario.nombre,
      // apellido: this.mAuth.usuario.apellido,
      // fechaNac: this.mAuth.usuario.fechaNac,
      // tel: this.mAuth.usuario.tel,
      // redSocial: this.mAuth.usuario.redSocial
    });
    //console.log(this.forma.controls);
  }

  siguiente() {
    console.log('hola');
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  atras() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }


  registro(){

    console.log(this.forma.get('fechaNac').value);

    if (this.forma.valid){
      let usuario: IUsuario;

      usuario = this.forma.value;

      usuario.redSocial = usuario.redSocial.filter( resp => resp.tipo !== null && resp.user !== null);

      usuario.role = 'VENDE';

      this.mAuth.register( usuario )
          .then( resp => {
            this.ui.mostrarInfo('Usuario Creado', 'Usuario creado correctamente!!!');
            this.cargarForm();
            this.atras();
          })
          .catch( err => {
            let mensaje = 'El usuario no se pudo crear';
            if ( err.code === 'auth/email-already-in-use') {
              mensaje = 'El email ya esta en uso';
            }
            this.ui.mostrarError('Error', mensaje);
          });

      // this.subscribeRegistro = this.mAuth.register( usuario )
      //         .subscribe( resp => {
      //             if ( resp.ok ) {
      //               this.ui.mostrarInfo('Usuario', 'Usuario creado correctamente!');
      //               this.router.navigate(['/login']);
      //             }
      //         });
    } else {
      this.ui.mostrarError('Error', 'Hay datos que no son validos');
    }
  }

  salir() {
    this.modal.dismiss({
      ok: true
    });
  }

}
