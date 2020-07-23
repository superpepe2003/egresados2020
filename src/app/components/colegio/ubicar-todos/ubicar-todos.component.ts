import { Component, OnInit, Input } from '@angular/core';

// UBICA TODOS LOS COLEGIOS

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
