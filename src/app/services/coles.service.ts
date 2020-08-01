import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { map, catchError, first, tap, mergeAll, switchMap, mergeMap, toArray, debounceTime } from 'rxjs/operators';
import { of, Observable, zip, from, merge, Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { IColegio } from '../models/colegio';
import { ICurso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class ColesService implements OnDestroy {

  subscribe: Subscription[] = [];

  colegios: IColegio[] = [];

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





  constructor( private http: HttpClient,
               private db: AngularFireDatabase ) { }


  // =========================================
  // COLEGIOS
  // =========================================

  existeColegioLocalidad( formcontrol: FormGroup) {
    const nombreLargo = formcontrol.get('nombre').value.trim().toLowerCase()
                  + '-' + formcontrol.get('localidad').value.trim().toLowerCase()
                  + '-' + formcontrol.get('provincia').value.trim().toLowerCase();

    return this.db.list('/colegios', ref => ref.orderByChild('nombreLargo')
                .equalTo(nombreLargo))
              .valueChanges()
              .pipe(
                debounceTime(500),
                first(),
                map( (isTaken: any) => ( (isTaken.length !== 0) ? { Existe: true } : null) )
             );
  }

  createColegio( mCole: IColegio) {

    const key = this.db.list('/colegios').push(true).key;
    mCole._id = key;
    return this.db.database.ref('colegios/' + key).set(mCole);

  }

  updateColegio( colegio: IColegio) {
    return this.db.database.ref('colegios/' + colegio._id).update(colegio);
  }

  // Modifica todos los cursos con los nuevos datos del colegio
  async updateCursos( col: IColegio ){
    console.log(col._id);
    this.subscribe.push( this.db.list('/cursos', ref => ref.orderByChild('idCole').equalTo(col._id) )
                .valueChanges()
                .subscribe( (cur: ICurso[]) => {
                    cur.map( async (resp) => {
                        resp.colegio = col.nombre;
                        resp.localidad = col.localidad;
                        await this.updateCurso({...resp});
                    });
                })
    );
  }

  getColegios() {
      this.subscribe.push( this.db.list<IColegio>('/colegios')
                .valueChanges()
                .pipe(
                  first()
                )
                .subscribe( resp => this.colegios = resp)
            );
  }

  getColegiosVendedor( id: string ) {
      this.subscribe.push( this.db.list<IColegio>('/colegios', ref => ref.orderByChild('creadopor').equalTo(id))
              .valueChanges()
              .pipe(
                first()
                )
              .subscribe( resp => this.colegios = resp)
      );
  }

  // =========================================
  // LOCALIDAD Y MUNICIPIOS
  // =========================================

  ubicaLocalidad( nombre: string ) {

      return this.http.get(`https://apis.datos.gob.ar/georef/api/municipios?nombre=${ nombre }&provincia=Buenos%20Aires`)
            .pipe(
                map((resp: any) => resp.municipios[0].centroide)
              );

  }

  getMunicipio( provincia: string) {

    return this.http.get(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${ provincia }&campos=nombre&max=500`)
            .pipe(
              map((resp: any) => {
                  return resp.municipios;
                })
              );
  }

  getProvincias() {
      return of(this.Provincias);
  }

  // getColegiosVendedorPruebas( id: string ) {
  //   const miArray = this.db.list<IColegio>('/colegios', ref => ref.orderByChild('creadopor').equalTo(id))
  //           .valueChanges()
  //           .pipe(
  //               first(),
  //               map( resp => from( resp )),
  //               mergeMap( resp2 => resp2 ),
  //               map( resp3 => zip( of(resp3), this.db.list('/users',
  //                                 ref => ref.orderByChild('colegio').equalTo(resp3.codigo))
  //                                 .valueChanges())),
  //               mergeMap(resp => resp),
  //               map( ([ colegios, alumnos ]) => ({ colegios, alumnos}) ),
  //               map( (resp: any ) => {
  //                 resp.colegios.alumnos = resp.alumnos;
  //                 return resp.colegios;
  //               } ),
  //               toArray()
  //           );

  //   miArray.subscribe( resp => {
  //       console.log('hola');
  //       console.log(resp );
  //   } );

  // }

 // =========================================
 // CURSOS
 // =========================================

 // Si el colegio no existe devuelve true, si no devuelve null, se usa como validador en formulario

  // colegioExiste( control: FormControl ): Observable < any > {
  cursoExiste( control: FormControl ) {
    const codigo = control.value.toLowerCase();
    return this.db.list('/cursos', ref => ref.orderByChild('codigo').equalTo(codigo))
                .valueChanges()
                .pipe(
                  first(),
                  map( (isTaken: any) => ( (isTaken.length === 0) ? { noExiste: true } : null) )
                );
  }

  cursoNoExiste( control: FormControl ) {
    const codigo = control.value.toLowerCase();

    return this.db.list('/cursos', ref => ref.orderByChild('codigo').equalTo(codigo))
            .valueChanges()
            .pipe(
              first(),
              map( (isTaken: any) => ( (isTaken.length !== 0) ? { Existe: true } : null) )
            );
  }

  cursoExisteCod( cod: string ){
      return this.db.list('/cursos', ref => ref.orderByChild('codigo').equalTo(cod.toLowerCase()))
              .valueChanges()
              .pipe(
                first()
              );
  }

  createCurso( mCurso: ICurso) {

    const key = this.db.list('/cursos').push(true).key;
    console.log(key);
    mCurso._id = key;
    return this.db.database.ref('cursos/' + key).set(mCurso);

  }

  updateCurso( mCurso: ICurso) {
    console.log(mCurso);
    return this.db.database.ref('cursos/' + mCurso._id).update(mCurso);
  }

  // si es true incrementa, si es false decrementa
  async updateIncrementaCurso( codigo, add ){
    const cur = await this.db.list<ICurso>('cursos/', ref => ref.orderByChild('codigo')
                        .equalTo( codigo ))
                        .valueChanges().pipe(first()).toPromise();
    if ( cur ) {
      let num = Number(cur[0].cant);
      if ( add ){
        num = num + 1 ;
      } else {
        num = num - 1 ;
      }
      cur[0].cant = num;
      this.updateCurso( cur[0]).then();
    }
  }

  getCursos() {
      return this.db.list<ICurso>('/cursos')
                .valueChanges()
                .pipe(
                  first(),
                  map( resp => {
                    resp.map( cur => {
                      this.db.list('/users',
                                  ref => ref.orderByChild('curCodigo').equalTo(cur.codigo))
                                  .valueChanges()
                                  .pipe(
                                    first()
                                  ).subscribe( (alum: any) => {
                                    cur.alumnos = alum || [];
                                  });
                    });
                    return resp;
                  })
                );
  }

  getCursosVendedor( tempVende: string ) {
      console.log(tempVende);
      return this.db.list<ICurso>('/cursos', ref => ref.orderByChild('tempVende').equalTo(tempVende))
              .valueChanges()
              .pipe(
                first()
                );
  }


  ngOnDestroy() {
    this.subscribe.forEach( resp => resp.unsubscribe());
  }


}
