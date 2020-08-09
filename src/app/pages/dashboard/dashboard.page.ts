import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { IPost } from '../../models/post';
import { PostsServiceService } from '../../services/posts-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  posts: IPost[];

  constructor( private dbPost: PostsServiceService) { }

  ngOnInit() {
    this.cargarPost();
  }

  doRefresh(e){
    this.cargarPost();
  }

  async cargarPost(){
    await this.dbPost.cargarPost().toPromise()
    .then( resp => {
      this.posts = resp;
    });
  }

}
