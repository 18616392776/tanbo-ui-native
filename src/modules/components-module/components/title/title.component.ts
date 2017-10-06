import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

const TWEEN = require('tween.js');

@Component({
    selector: 'ui-title',
    templateUrl: './title.component.html'
})
export class TitleComponent implements OnDestroy, OnInit {
    @HostBinding('style.transform')
    translate: string;
    @HostBinding('style.opacity')
    opacity: number;
    private sub: Subscription;

    constructor(private viewStateService: ViewStateService) {
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = TWEEN.Easing.Cubic.Out(status.progress / 100);
            let n: number;
            switch (status.state) {
                case ViewState.Activate:
                    this.translate = `translateX(${70 - progress * 70}%)`;
                    break;
                case ViewState.Destroy:
                    this.translate = `translateX(${progress * 70}%)`;
                    break;
                case ViewState.ToStack:
                    this.translate = `translateX(${progress * -48}%)`;
                    n = 1 - progress * 1.3;
                    this.opacity = n < 0 ? 0 : n;
                    break;
                case ViewState.Reactivate:
                    this.translate = `translateX(${-48 + progress * 48}%)`;
                    n = progress * 2;
                    this.opacity = n > 1 ? 1 : n;
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}