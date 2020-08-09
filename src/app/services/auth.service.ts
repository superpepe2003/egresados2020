import { Injectable, OnDestroy, Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { IUsuario } from '../models/usuario';
import { AngularFireAuth } from '@angular/fire/auth';
import { Componente } from '../models/menu';
import { Storage } from '@ionic/storage';
import { first, finalize, tap, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ColesService } from './coles.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{

  token = '';
  initialized = false;

  subscrition: Subscription[] = [];
  authState = new BehaviorSubject(false);

  usuario = {} as IUsuario;
  vendedores: IUsuario[] = [];

  menu: Observable<Componente[]>;

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;


  constructor( private storage: Storage,
               private mAuth: AngularFireAuth,
               private db: AngularFireDatabase,
               private http: HttpClient,
               private mStorage: AngularFireStorage,
               private mCole: ColesService) {

  }

  async inicial(){
    await this.leerUserStorage();
  }

  islogeado() {
     return this.authState.value;
  }


  login(e: string, pass: string) {

    return new Promise( (resolve, reject ) => {
            this.mAuth.signInWithEmailAndPassword( e, pass )
                .then( async ( user: any ) => {
                  this.usuario._id = user.user.uid;
                  this.authState.next( true );
                  await this.cargarPerfil();
                  this.grabarUser();
                  this.getMenuOpts();
                  resolve( this.usuario );
                })
                .catch( err => reject( err ));
    });

  }

  logout() {
    this.mAuth.signOut().then( auth => {
      this.usuario = {} as IUsuario;
      this.storage.clear();
      this.authState.next(false);
      return true;
    });
  }

  register( usuario: IUsuario){

    return new Promise( ( resolve, reject ) => {
        this.mAuth.createUserWithEmailAndPassword( usuario.email, usuario.password )
            .then( async (resp) => {
                this.usuario._id = resp.user.uid;
                usuario._id = resp.user.uid;
                const us = await this.crearPerfil( usuario );
                if ( usuario.curCodigo ){
                  this.mCole.updateIncrementaCurso(usuario.curCodigo, true);
                }
                resolve( us );
            })
            .catch( err => {
              reject( err );
            });
    });

  }

  crearPerfil(usuario: IUsuario) {
    // const userId = usuario._id;

    const tempUser: any = { ...usuario };

    delete tempUser.password;

    return this.db.database.ref('users/' + usuario._id).set(tempUser);

  }

  // crearPerfil(usuario: IUsuario){
  //   const tempUser: any = { ...usuario };

  //   delete tempUser.password;

  //   return this._db.collection('users/').doc(usuario._id).set(tempUser);
  // }

  updateUsuario(usuario: IUsuario) {
    return this.db.database.ref('users/' + this.usuario._id).update(usuario);
  }

  updateAlumno(usuario: IUsuario) {
    return this.db.database.ref('users/' + usuario._id).update(usuario);
  }

  subirFoto( datos: any) {
    const ref = `imagenPerfil/${this.usuario._id}`;
    const refPicture = this.mStorage.ref(ref);
    const tarea = refPicture.putString( datos, 'data_url');

    this.subscrition.push( tarea.snapshotChanges().pipe(
                finalize( async ( ) => {
                  this.usuario.img = await this.mStorage.ref(ref).getDownloadURL().toPromise();
                  this.updateUsuario( this.usuario ); }
                ))
              .subscribe()
              );
  }

  deleteAlumno( id ) {
    return this.db.database.ref('users/' + id).remove();
  }

  async cargarPerfil() {
    if ( this.usuario._id ) {

      const userId = this.usuario._id;
      this.usuario  = await this.db.object<IUsuario>('users/' + userId).valueChanges().pipe(first()).toPromise();

      return this.usuario;
    }
  }

  //retorna vendedores
  getVendedores() {
    return this.db.list<IUsuario>('users/', ref => ref.orderByChild('role').equalTo('VENDE'))
              .valueChanges()
              .pipe( first());

  }

  getAlumnos( codigo ) {
    return this.db.list<IUsuario>('users/', ref => ref.orderByChild('curCodigo').equalTo( codigo ))
              .valueChanges()
              .pipe( first());
  }

  grabarUser(){

    this.storage.set('egresadosUser', this.usuario._id);

  }

  // lee el vendedor desde el id guardado en storage para loguear
  async leerUserStorage(){
    this.usuario._id = await this.storage.get('egresadosUser');

    if ( this.usuario._id){
      this.authState.next(true);
      await this.cargarPerfil();
    }
  }

  async getMenuOpts() {
    let uri = '';
    switch ( this.usuario.role ){
        case 'ADMIN':
          uri = '/assets/data/menu-admin.json';
          break;
        case 'VENDE':
          uri = '/assets/data/menu-vende.json';
          break;
        case 'OPERA':
          uri = '/assets/data/menu-opera.json';
          break;
        default :
          uri = '/assets/data/menu.json';
          break;
    }
    this.menu =  this.http.get<Componente[]>(uri);
  }


  ngOnDestroy() {
    this.subscrition.forEach( resp => resp.unsubscribe() );
  }

}
