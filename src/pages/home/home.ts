import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';

import { ModalController, DialogController, AlertController } from '../../tanbo/ui-native/public_api';

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  value = 'bbbb';
  data: any[] = [];

  date = '2013-02-3';

  ngOnInit() {
    setTimeout(() => {
      this.data = [{
        text: 'aaaa',
        value: 'aaaa'
      }, {
        text: 'bbbb',
        value: 'bbbb'
      }, {
        text: 'cccc',
        value: 'cccc'
      }];
    }, 200);
  }
}
