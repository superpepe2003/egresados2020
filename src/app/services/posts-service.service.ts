import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { IPost } from '../models/post';
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {

  constructor( private db: AngularFireDatabase,
               private fbstorage: AngularFireStorage) { }

  cargarPost(){
    return this.db.list<IPost>('post/')
           .valueChanges()
           .pipe(
             first()
           );
  }
}
