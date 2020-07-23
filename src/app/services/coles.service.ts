import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { map, catchError, first, tap, mergeAll, switchMap, mergeMap, toArray } from 'rxjs/operators';
import { of, Observable, zip, from, merge } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { IColegio } from '../models/colegio';

@Injectable({
  providedIn: 'root'
})
export class ColesService implements OnDestroy {

  Provincias = [
    'Buenos Aires',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Cordoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquen',
    'Rio Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucuman'
  ];





  constructor( private mAuth: AuthService,
               private http: HttpClient,
               private db: AngularFireDatabase ) { }


  // Si el colegio no existe devuelve true, si no devuelve null, se usa como validador en formulario

  // colegioExiste( control: FormControl ): Observable < any > {
  colegioExiste( control: FormControl ) {
        const codigo = control.value;

        // this.db.list('colegios/', ref =>
        //   ref.orderByKey().equalTo({ value: codigo, key: 'codigo' })
        // ).valueChanges().subscribe( console.log );

        return this.db.list('/colegios', ref => ref.orderByChild('codigo').equalTo(codigo))
                .valueChanges()
                .pipe(
                  first(),
                  map( (isTaken: any) => ( (isTaken.length === 0) ? { noExiste: true } : null) )
                );
  }

  colegioExisteCod( cod: string ){
      return this.db.list('/colegios', ref => ref.orderByChild('codigo').equalTo(cod))
              .valueChanges()
              .pipe(
                first()
              );
  }

  createColegio( mCole: IColegio) {

    //this.db.database.ref('/colegios').push(true).key;

    const key = this.db.list('/colegios').push(true).key;
    console.log(key);
    mCole._id = key;
    return this.db.database.ref('colegios/' + key).set(mCole);

  }

  updateColegio( colegio: IColegio) {
    return this.db.database.ref('colegios/' + colegio._id).update(colegio);
  }

  getColegios() {
      return this.db.list<IColegio>('/colegios')
                .valueChanges()
                .pipe(
                  first(),
                  map( resp => {
                    resp.map( col => {
                      this.db.list('/users',
                                  ref => ref.orderByChild('colegio').equalTo(col.codigo))
                                  .valueChanges()
                                  .pipe(
                                    first()
                                  ).subscribe( (alum: any) => {
                                    col.alumnos = alum;
                                  });
                    });
                    return resp;
                  })
                );
  }

  getColegiosVendedor( id: string ) {
      return this.db.list<IColegio>('/colegios', ref => ref.orderByChild('creadopor').equalTo(id))
              .valueChanges()
              .pipe(
                first(),
                map( resp => {
                  resp.map( col => {
                    this.db.list('/users',
                                ref => ref.orderByChild('colegio').equalTo(col.codigo))
                                .valueChanges()
                                .pipe(
                                  first()
                                ).subscribe( (alum: any) => {
                                  if ( alum) {
                                    col.alumnos = alum;
                                  } else {
                                    col.alumnos = [];
                                  }
                                });
                  });
                  return resp;
                })
              );
  }

  ubicaLocalidad( nombre: string ) {

      return this.http.get(`https://apis.datos.gob.ar/georef/api/municipios?nombre=${ nombre }&provincia=Buenos%20Aires`)
            .pipe(
                map((resp: any) => resp.municipios[0].centroide)
              );

    }

  getProvincias() {
      return of(this.Provincias);
  }

  ngOnDestroy() {

  }

  getColegiosVendedorPruebas( id: string ) {
    const miArray = this.db.list<IColegio>('/colegios', ref => ref.orderByChild('creadopor').equalTo(id))
            .valueChanges()
            .pipe(
                first(),
                map( resp => from( resp )),
                mergeMap( resp2 => resp2 ),
                map( resp3 => zip( of(resp3), this.db.list('/users',
                                  ref => ref.orderByChild('colegio').equalTo(resp3.codigo))
                                  .valueChanges())),
                mergeMap(resp => resp),
                map( ([ colegios, alumnos ]) => ({ colegios, alumnos}) ),
                map( (resp: any ) => {
                  resp.colegios.alumnos = resp.alumnos;
                  return resp.colegios;
                } ),
                toArray()

                // map( resp => {
                //   resp.map( col => {
                //     this.db.list('/users',
                //                 ref => ref.orderByChild('colegio').equalTo(col.codigo))
                //                 .valueChanges()
                //                 .pipe(
                //                 ).subscribe( (alum: any) => {
                //                   if ( alum) {
                //                     col.alumnos = alum;
                //                   } else {
                //                     col.alumnos = [];
                //                   }
                //                 });
                //   });
                //  return resp;
                //})
            );
    
    miArray.subscribe( resp => {
        console.log('hola');
        console.log(resp );
    } );

//             .subscribe( resp => {
//               console.log('1');
//               console.log(resp);
//             } );
 }

}
