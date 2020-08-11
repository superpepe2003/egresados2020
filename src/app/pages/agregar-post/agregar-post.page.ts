import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsServiceService } from '../../services/posts-service.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { IPost } from '../../models/post';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

declare var window: any;

@Component({
  selector: 'app-agregar-post',
  templateUrl: './agregar-post.page.html',
  styleUrls: ['./agregar-post.page.scss'],
})
export class AgregarPostPage implements OnInit {

  tempImages: string[] = [];
  cargandoGeo = false;


  Guardando = false;

  post: IPost = {
    mensaje: '',
    titulo: '',
    subtitulo: '',
    created: 0,
    imgs: []
  };

  constructor(private postsService: PostsServiceService,
              private route: Router,
              private ui: UiService,
              private imgPicker: ImagePicker,
              private file: File) { }

  ngOnInit() {
  }

  cargarImagenes() {

    const options: ImagePickerOptions = {
      maximumImagesCount: 5,
      width: 600,
      height: 600
    }

    this.imgPicker.getPictures(options).then((results) => {

      // tslint:disable-next-line:prefer-for-of
      for ( const value of results) {
        const fileName = value.substring(value.lastIndexOf('/') + 1);
        const path = value.substring(0, value.lastIndexOf('/') + 1);

        this.file.readAsDataURL(path, fileName).then(( base64string ) => {
          this.tempImages.push( base64string );
         });
      }
    }, (err) => { });
  }

  sacarImagen( i: number){
    this.tempImages.splice( i, 1);
  }

  crearPost() {
     this.Guardando = true;
     this.post.created = new Date().getTime() * -1;
     this.postsService.crearPost( this.post, this.tempImages )
         .then( resp => {
            this.limpiarCampos();
            this.Guardando = false;
          })
         .catch( err => this.ui.mostrarError('Error', 'No se pudo Guardar el Post'));
  }

  limpiarCampos(){
    this.tempImages = [];
    // tslint:disable-next-line:forin
    for ( const valor in this.post ){
      if ( valor === 'imgs'){
        this.post.imgs = [];
      } else {
        this.post[valor] = '';
      }
    }
  }


}
