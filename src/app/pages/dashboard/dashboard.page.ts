import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { IPost } from '../../models/post';
import { PostsServiceService } from '../../services/posts-service.service';
import { RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  posts: IPost[] = [];
  habilitado = true;

  constructor( private dbPost: PostsServiceService) { }

  ngOnInit() {
    this.cargarPost( null, true);
  }

  doRefresh(e){
    this.cargarPost( e, true );
    this.habilitado = true;
    this.posts = [];
  }

  async cargarPost( e?, pull: boolean = false ){

    // Envio el ultimo o la fecha actual para seguir o empezar a cargar los post paginados
    let last;
    if ( !pull ){
      last = this.posts[ this.posts.length - 1 ].created + 1 ;
    } else {
      last = new Date().getTime() * -1;
    }

    await this.dbPost.cargarPost( pull, last )
          .toPromise()
          .then( resp => {

            this.posts.push( ...resp );

            if ( e ) {
              e.target.complete();

              if ( resp.length === 0) {
                this.habilitado = false;
              }
            }

          });
  }

  siguientes( event ) {
    this.cargarPost( event );
  }

  gabrartiempoInvertido( ){
    this.dbPost.grabarTeimpoInvertido(this.posts);
  }

}
