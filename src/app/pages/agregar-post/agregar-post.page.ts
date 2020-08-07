import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsServiceService } from '../../services/posts-service.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-agregar-post',
  templateUrl: './agregar-post.page.html',
  styleUrls: ['./agregar-post.page.scss'],
})
export class AgregarPostPage implements OnInit {

  tempImages: string[] = [];
  cargandoGeo = false;

  post = {
    mensaje: '',
    posicion: false
  };

  constructor(private postsService: PostsServiceService,
              private route: Router,
              private camera: Camera) { }

  ngOnInit() {
  }

  camara() {

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.procesarImagen( options );

  }

  libreria() {

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.procesarImagen( options );

  }


  procesarImagen( options: CameraOptions ) {

    this.camera.getPicture(options).then( ( imageData ) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

      const img = window.Ionic.WebView.convertFileSrc( imageData );

      //this.postsService.subirImagen( imageData );
      this.tempImages.push( img );

     }, (err) => {
      // Handle error
     });
  }

}
