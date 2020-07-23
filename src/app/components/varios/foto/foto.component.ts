import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';

declare var window: any;

@Component({
  selector: 'app-foto',
  templateUrl: './foto.component.html',
  styleUrls: ['./foto.component.scss'],
})
export class FotoComponent implements OnInit {

  @Input() imagen = null;
  @Input() isAlumno = false;

  constructor( public mAuth: AuthService,
               private alertCtrl: AlertController,
               private camera: Camera) { }

  ngOnInit() {}

  async cargarImage(){
    const input = await this.alertCtrl.create({

      header: 'Imagen',
      inputs: [
      ],
      buttons: [
        {
          text: 'Camara',
          handler: ( ) => {
            this.camara( );
          }
        },
        {
          text: 'Galleria',
          handler: ( ) => {
            this.galeria( );
          }
        }
      ]

    });

    await input.present();
  }

  camara() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.procesarImagen( options );

  }

  galeria(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.procesarImagen( options );

  }

  procesarImagen(options ) {
    this.camera.getPicture(options).then((imageData) => {

      const img = 'data:image/jpeg;base64,' + imageData;

      this.suboFoto( img );
      //this.mAuth.updateImagen(img);
     }, (err) => {
      // Handle error
     });
  }

  suboFoto( img ){
    const tarea = this.mAuth.subirFoto( img );
  }
}

