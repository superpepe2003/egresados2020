import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { ModificarPerfilComponent } from '../../usuario/modificar-perfil/modificar-perfil.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  //componentes: Observable<Componente[]>;

  constructor( public mAuth: AuthService,
               private menu: MenuController,
               private nav: NavController,
               private modalCtrl: ModalController ) {
                 
              }

  async ngOnInit() {
    await this.mAuth.inicial();
    this.mAuth.getMenuOpts();
  }

  ionViewWillEnter(){
    console.log('Estoy en el menu');
  }

  onlogout() {
    this.menu.close();
    this.mAuth.menu = null;
    this.nav.navigateRoot(['login']);
    this.mAuth.logout();
  }

  async onPerfil() {
    const oPerfil = await this.modalCtrl.create({
      component: ModificarPerfilComponent
    });

    await oPerfil.present();
  }


}
