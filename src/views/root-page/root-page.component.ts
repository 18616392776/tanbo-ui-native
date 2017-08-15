import { Component } from '@angular/core';
import { NavController } from '../../modules/index';

import { Page1Component } from '../page1/page1.component';

@Component({
    selector: 'ui-root',
    templateUrl: './root-page.component.html'
})
export class RootPageComponent {
    constructor(private navController: NavController) {
    }

    goToPage1() {
        this.navController.push(Page1Component);
    }
}