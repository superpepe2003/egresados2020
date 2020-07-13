import { Component } from '@angular/core';
import { OAuthServiceService } from '../../services/o-auth-service.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor( public mAuth: OAuthServiceService) {
    console.log('tabs');
    this.mAuth.inicial();
  }

}
