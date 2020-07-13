import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, tap, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OAuthServiceService } from './o-auth-service.service';
import { IColegio } from '../models/colegio';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColegiosService implements OnDestroy {

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

  url = environment.url;
  // url = 'http://localhost:3000';




constructor( private mAuth: OAuthServiceService,
             private http: HttpClient ) { }



colegioExiste( control: FormControl ): Observable < any > {
      const codigo = control.value;

      return this.http.get(`${ this.url }/colegio/existe/${ codigo }`)
              .pipe(
                map((isTaken: any) => ( (!isTaken.ok) ? { noExiste: true } : null)),
                catchError(() => of(null))
              );
}

createColegio( mCole: IColegio) {

    const headers = new HttpHeaders({
      token: this.mAuth.token
    });

    return this.http.post(`${ this.url }/colegio`, mCole, { headers });
}

updateColegio( mCole: IColegio) {
  const headers = new HttpHeaders({
    token: this.mAuth.token
  });

  let params = new HttpParams();

  params = params.append('id', mCole._id);

  return this.http.put(`${ this.url }/colegio/${ mCole._id }`, mCole, { headers });
}

getColegios() {
    const headers = new HttpHeaders({
      token: this.mAuth.token
    });

    return this.http.get(`${ this.url }/colegio`, { headers });
  }

getColegiosVendedor( id: string ) {
    const headers = new HttpHeaders({
      token: this.mAuth.token
    });

    return this.http.get(`${ this.url }/colegio/vendedor/${id}`, { headers });
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

}
