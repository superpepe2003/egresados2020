import { Component, OnInit, Input } from '@angular/core';
import { IPost } from '../../../models/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  @Input() posts: IPost[] = [];

  constructor() {
  }

  ngOnInit() {
  }

}
