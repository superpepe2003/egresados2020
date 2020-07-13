import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OAuthServiceService } from './services/o-auth-service.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: OAuthServiceService
  ) {

    this.initializeApp();
    console.log('app');
  }

  async initializeApp() {
    await this.platform.ready().then( async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //para iniciar el servicio

      console.log('app2');
    });
  }
}
