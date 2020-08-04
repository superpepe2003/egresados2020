import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IonSlides, NavController } from '@ionic/angular';
import { IUsuario } from '../../models/usuario';
import { rejects } from 'assert';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { ColesService } from '../../services/coles.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit{

  forma: FormGroup;
  

  slidesOptions = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  @ViewChild( IonSlides, { static: false } ) slides: IonSlides;


  constructor(public mAuth: AuthService,
              private mCole: ColesService,
              private router: Router,
              private formBuilder: FormBuilder,
              private ui: UiService) {

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

  campoValido( campo: string ){
    return this.forma.get(campo).valid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      email: ['', [ Validators.required , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,3}$') ]],
      password: ['', [ Validators.required, Validators.minLength(6) ]],
      curCodigo: ['', Validators.required, this.mCole.cursoExiste.bind(this.mCole) ],
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
        ]),
      experiencia: ['', [ Validators.required ]],
      empresas: this.formBuilder.array([]),
      referencia: ['', [ Validators.required ]],
      telPadre: ['', [Validators.required]]
    });

  }

  // agregarRedSocial() {
  //   this.redsociales.push( this.formBuilder.group( {} )  );
  // }

  cargarForm() {
    this.forma.reset({
      email: 'a@a.com',
      password: '123123',
      nombre: 'pablo',
      apellido: 'Fretes',
      curCodigo: 'pol22310',
      fechaNac: ( new Date() ).toJSON()
    });
    // console.log(this.forma.controls);
  }

  siguiente() {
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

    if (this.forma.valid){
      let usuario: IUsuario;

      usuario = this.forma.value;

      usuario.redSocial = usuario.redSocial.filter( resp => resp.tipo !== null && resp.user !== null);

      usuario.curCodigo = usuario.curCodigo.toLowerCase();

      this.mAuth.register( usuario )
          .then( resp => {
            this.ui.mostrarInfo('Usuario Creado', 'Usuario creado correctamente!!!');
            this.router.navigateByUrl('/login');
          })
          .catch( err => {
            let mensaje = 'El usuario no se pudo crear';
            if ( err.code === 'auth/email-already-in-use') {
              mensaje = 'El email ya esta en uso';
            }
            this.ui.mostrarError('Error', mensaje);
          });

    } else {
      this.ui.mostrarError('Error', 'Hay datos que no son validos');
    }

  }

  merror(){
    console.log('estoy');
    console.log( this.forma.get('colegio') );
  }

  onChange(emp: string, isChecked: boolean) {
    const empresas = this.forma.controls.empresas as FormArray;
    // if target checked, push to formarray, else remove
    if (isChecked) {
      empresas.push(new FormControl(emp));
    } else {
      const index = empresas.controls.findIndex(x => x.value === emp);
      empresas.removeAt(index);
    }
  }

}
