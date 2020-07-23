import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor( private oAuth: AuthService,
               private router: Router){

  }

  async canActivate(): Promise<boolean> {

    await this.oAuth.inicial();
    console.log('estoy');
    console.log(this.oAuth.islogeado());

    if ( !this.oAuth.islogeado() ) {
      this.router.navigateByUrl('login');
      return false;
    } else {
      return true;
    }

  }
}
