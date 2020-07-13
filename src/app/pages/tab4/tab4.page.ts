import { Component, OnInit } from '@angular/core';
import { OAuthServiceService } from '../../services/o-auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor( private mAuth: OAuthServiceService,
               private router: Router) { }

  ngOnInit() {
  }

  logout() {

    if (this.mAuth.logout() ) {
      this.router.navigate(['/login']);
    }

  }

}
