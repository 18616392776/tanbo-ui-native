import { Component, AfterViewInit } from '@angular/core';
import { PullDownRefreshController } from '../../modules/index';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements AfterViewInit {
    constructor(private pullDownRefreshController: PullDownRefreshController) {
    }

    ngAfterViewInit() {
        // this.pullDownRefreshController.refresh();
    }

    pan(event: any) {
        console.log(event.deltaX);
        // console.log(event.additionalEvent , event.distance);
    }

    drag(n: number) {
        // this.progress = n;
    }

    loaded() {
        this.pullDownRefreshController.refreshEnd();
    }
}