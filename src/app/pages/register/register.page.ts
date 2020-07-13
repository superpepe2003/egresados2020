import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OAuthServiceService } from '../../services/o-auth-service.service';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IonSlides } from '@ionic/angular';
import { IUsuario } from '../../models/usuario';
import { rejects } from 'assert';
import { ColegiosService } from '../../services/colegios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy{

  forma: FormGroup;
  subscribeRegistro: Subscription;

  @ViewChild( IonSlides, { static: false } ) slides: IonSlides;


  constructor(public mAuth: OAuthServiceService,
              private mCole: ColegiosService,
              private router: Router,
              private formBuilder: FormBuilder) {

      this.crearFormulario();
      this.cargarForm();

  }


  ngOnInit() {
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
      colegio: ['', Validators.required, this.mCole.colegioExiste.bind(this.mCole) ],
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

  // agregarRedSocial() {
  //   this.redsociales.push( this.formBuilder.group( {} )  );
  // }

  cargarForm() {
    this.forma.reset({
      email: 'a@a.com',
      password: '123123',
      nombre: 'pablo',
      apellido: 'Fretes',
      colegio: 'pol14310',
      fechaNac: '14/10/2003'
    });
    //console.log(this.forma.controls);
  }

  siguiente() {
    this.slides.slideNext();
    console.log(this.campoNoValido('colegio'));
  }

  atras() {
    this.slides.slidePrev();
  }

  registro(){

    console.log(this.forma.get('fechaNac').value);

    if (this.forma.valid){
      let usuario: IUsuario;

      usuario = this.forma.value;

      usuario.redSocial = usuario.redSocial.filter( resp => resp.tipo !== null);

      console.log(usuario);

      this.subscribeRegistro = this.mAuth.register( usuario )
              .subscribe( resp => {
                  if ( resp.ok ) {
                    this.router.navigate(['/login']);
                  }
              });
    }

  }

  merror(){
    console.log('estoy');
    console.log( this.forma.get('colegio') );
  }

  ngOnDestroy() {
    if( this.subscribeRegistro ){
      this.subscribeRegistro.unsubscribe();
    }
  }

}
