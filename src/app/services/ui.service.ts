import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor( private alertController: AlertController,
               private toastController: ToastController) { }

  async presentAlert( message: string ) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 1500
    });
    toast.present();
  }

  mostrarError( titulo: string, cuerpo: string) {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: cuerpo
    });
  }


  mostrarInfo( titulo: string, cuerpo: string) {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: cuerpo
    });
  }
}
