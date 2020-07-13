import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OAuthServiceService } from '../services/o-auth-service.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor( private oAuth: OAuthServiceService,
               private router: Router){

  }

  async canActivate(): Promise<boolean> {

    await this.oAuth.inicial();

    console.log('authguard');
    if ( !this.oAuth.islogeado() ) {
      this.router.navigateByUrl('login');
      return false;
    } else {
      return true;
    }

  }
}
