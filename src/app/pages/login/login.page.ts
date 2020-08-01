import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  forma: FormGroup;
  subscribeLogin: Subscription;

  cargando = false;


  constructor(private mAuth: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private ui: UiService) {

      this.crearFormulario();
      this.cargarForm();

  }


  ngOnInit() {
  }

  campoNoValido( campo: string ) {
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      email: ['', [ Validators.required , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,3}$') ]],
      password: ['', [ Validators.required ]]
    });

  }

  cargarForm() {
    this.forma.reset({
      email: 'a@a.com',
      password: '123123'});
  }

  onLogin() {
    this.cargando = true;
    if (this.forma.valid) {

      this.mAuth.login(this.forma.controls['email'].value, this.forma.controls['password'].value)
          .then( resp => {
            if ( !resp ) {
              this.cargando = false;
              this.ui.mostrarError('Error', 'Usuario o password incorrecto!');
              return;
            }
            this.cargando = false;
            this.router.navigate(['/dashboard']);
          })
          .catch( err => {
            console.log( err );
            this.ui.mostrarError('Error', 'Usuario o password incorrecto!' );
            this.cargando = false;
          });
          // .subscribe(user => {
  
          //     console.log(user);
          //     if ( !user.ok ){
          //       this.cargando = false;
          //       this.ui.mostrarError('Error', 'Usuario o password incorrecto!');
          //       return;
          //     }
  
          //     this.mAuth.usuario = user.usuario;
          //     this.mAuth.token = user.token;
          //     this.mAuth.authState.next(true);
          //     this.mAuth.grabarToken();
  
          //     this.cargando = false;
  
          //     this.router.navigate(['/dashboard']);
          // });
    }
    else {
      this.cargando = false;
      this.ui.mostrarError('Error', 'Hay errores en los campos de datos');
    }
  }

  register() {
    this.router.navigate(['register']);
  }

  ngOnDestroy() {
    if ( this.subscribeLogin ){
      this.subscribeLogin.unsubscribe();
    }
  }

}
