import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap, first } from 'rxjs/operators';
import { of, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IUsuario } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuthServiceService implements OnDestroy {

  token = '';
  initialized = false;

  subcribeUsuarioToken: Subscription;
  authState = new BehaviorSubject(false);

  usuario: IUsuario;

  url = environment.url;
  //url = 'http://localhost:3000';

  constructor( private http: HttpClient,
               private storage: Storage) {

  }

  async inicial(){
    const resp = await this.leerToken( true );
  }

  islogeado() {
    return this.authState.value;
  }


  login(e: string, pass: string) {

    const user = {
      email: e,
      password: pass
    };

    console.log(user);
    console.log('PIDO');

    return this.http.post(`${ this.url }/login`, user)
        .pipe(
          catchError( resp => of(resp.error) )
        );

  }

  logout() {
    this.storage.clear();
    return true;
  }

  register( usuario: IUsuario){

    return this.http.post(`${ this.url }/usuario/alumno`, usuario )
              .pipe(
                tap( console.log )
              );

  }

  updateUsuario( usuario: IUsuario ){

    const headers = new HttpHeaders({
      token: this.token
    });

    return this.http.put(`${ this.url }/usuario/$usuario._id`, usuario, { headers });

  }

  deleteAlumno( id: string ){
    const headers = new HttpHeaders({
      token: this.token
    });

    return this.http.delete(`${ this.url }/usuario/alumno/${ id }`, { headers });
  }

  deleteUsuario( id: string ){
    const headers = new HttpHeaders({
      token: this.token
    });

    return this.http.delete(`${ this.url }/usuario/${ id }`, { headers });
  }

  async getUsuarioToken() {
    const { usuario } = await this.http.get<any>(`${ this.url }/usuario/token/${this.token}`).toPromise();
    return usuario;
    // return this.subcribeUsuarioToken = await this.http.get(`${ this.url }/usuario/token/${this.token}`)
    //     .subscribe( (resp: any) => {
    //         this.usuario = resp.usuario;
    //         console.log(this.usuario.role);
    //     });
  }

  grabarToken(){

    this.storage.set('egresadosToken', this.token);

  }

  async leerToken( traerUsuario ){
    await this.storage.get('egresadosToken')
        .then( async (resp) => {
          if ( resp ) {
            this.authState.next(true);
            this.token = resp || '';
            if ( traerUsuario ) {
              this.usuario = await this.getUsuarioToken();
            }
          }

        });
  }


  ngOnDestroy() {
    if ( this.subcribeUsuarioToken ) {
      this.subcribeUsuarioToken.unsubscribe();
    }
  }

}
