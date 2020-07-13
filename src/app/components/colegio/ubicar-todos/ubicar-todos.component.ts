import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ubicar-todos',
  templateUrl: './ubicar-todos.component.html',
  styleUrls: ['./ubicar-todos.component.scss'],
})
export class UbicarTodosComponent implements OnInit {

  @Input() colegios;

  constructor() { }

  ngOnInit() {}

}
