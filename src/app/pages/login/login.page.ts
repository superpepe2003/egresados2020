import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OAuthServiceService } from '../../services/o-auth-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  forma: FormGroup;
  subscribeLogin: Subscription;


  constructor(private mAuth: OAuthServiceService,
              private router: Router,
              private formBuilder: FormBuilder) {

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
    if (this.forma.valid) {

      this.mAuth.login(this.forma.controls['email'].value, this.forma.controls['password'].value)
        .subscribe(user => {

            console.log(user);
            if ( !user.ok ){
              console.log( 'Error: ', user.err );
              return;
              //this.mAuth.presentToast('El mail o la contraseña no son correctos');
            }

            this.mAuth.usuario = user.usuario;
            this.mAuth.token = user.token;
            this.mAuth.authState.next(true);
            this.mAuth.grabarToken();

            this.router.navigate(['/tabs']);
        });
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
