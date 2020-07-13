import { Component, OnInit, Input } from '@angular/core';
import { IUsuario } from '../../../models/usuario';
import { OAuthServiceService } from '../../../services/o-auth-service.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
})
export class AlumnosComponent implements OnInit {
  
  @Input() alumnos: IUsuario[];

  constructor( private mAuth: OAuthServiceService) { }

  ngOnInit() {}

  cambiarCole( id: string ){
    //this.mAuth.updateUsuario()
  }

  eliminar( id: string ) {
    console.log(id);
    this.mAuth.deleteAlumno( id )
      .subscribe( (resp: any) => {
        console.log(resp);
        if ( resp.ok ) {
          this.alumnos = this.alumnos.filter( r => r._id !== id);
        }
      });
  }

}
