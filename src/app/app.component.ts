import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { Componente } from './models/menu';
import { AuthService } from './services/auth.service';
import { ColesService } from './services/coles.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  componentes: Observable<Componente[]>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
    private cole: ColesService
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
  //   await this.authService.inicial();
  }

  async initializeApp() {
    await this.platform.ready().then( async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }
}
