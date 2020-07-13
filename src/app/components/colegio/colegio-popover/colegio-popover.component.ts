import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-colegio-popover',
  templateUrl: './colegio-popover.component.html',
  styleUrls: ['./colegio-popover.component.scss'],
})
export class ColegioPopoverComponent implements OnInit {

  constructor( private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  onclick( valor: number ) {

    console.log('item:', valor);

    this.popoverCtrl.dismiss({
      item: valor
    });

  }

}
