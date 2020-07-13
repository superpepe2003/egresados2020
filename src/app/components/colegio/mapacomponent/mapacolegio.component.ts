import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mapacolegio',
  templateUrl: './mapacolegio.component.html',
  styleUrls: ['./mapacolegio.component.scss'],
})
export class MapacolegioComponent implements OnInit {

  @Input() ubicacion;
  @Input() nombre;

  constructor() { }

  ngOnInit() {}

}
