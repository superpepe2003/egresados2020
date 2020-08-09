import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { IPost } from '../models/post';
import { first, finalize } from 'rxjs/operators';
import { zip, forkJoin, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostsServiceService implements OnDestroy {

  contadorFotos = 0;
  totalFotos = 0;

  refer = [];

  subcribe: Subscription[] = [];

  constructor( private db: AngularFireDatabase,
               private fbstorage: AngularFireStorage) { }

  
  crearPost( post: IPost, tempImage: string[]){

    post._id = this.db.list('/post').push(true).key;

    return new Promise( (resolve) => {
      this.subcribe.push( this.subirFotos( tempImage, post._id )
          .subscribe( resp => {
            const url$ = this.refer.map( ref => this.fbstorage.ref( ref ).getDownloadURL())
      
            // COMPLETO TODOS LOS OBSERVABLES PARA RECUPERAR EL URL DE LAS FOTOS
      
            this.subcribe.push( forkJoin( ...url$ )
              .subscribe( r => {
                for( const value of r ) { post.imgs.push(value); }
                // GRABO EL POST
                this.db.database.ref('post/' + post._id).set(post).then( resp => resolve( true ) );
              })
            ); 
          })
        );
    });
  }


  subirFotos( tempImage: string[], id ) {
  
      let i = -1;
  
      const pro$ = tempImage.map( image => {
  
         i++;
         const ref = `post/${ id }/${ i }`;
  
         this.refer.push( ref );
         return this.fbstorage.ref( ref ).putString( image, 'data_url').snapshotChanges();
  
      });
  
      // COMPLETO TODOS LOS OBSERVABLES DE SUBIR FOTOS

      return forkJoin( ...pro$ );

  }


  cargarPost(){
    return this.db.list<IPost>('post/')
           .valueChanges()
           .pipe(
             first()
           );
  }

  ngOnDestroy () {
    this.subcribe.forEach( resp => resp.unsubscribe());
  }

}
