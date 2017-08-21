import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { NavController } from './navigation-controller.service';
import { ViewState } from './view-state';

@Component({
    selector: 'ui-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    views: Array<any> = [];

    private subs: Array<Subscription> = [];
    private popAction$: Observable<void>;
    private popActionSource = new Subject<void>();

    constructor(private navController: NavController) {
        this.popAction$ = this.popActionSource.asObservable();
    }

    ngOnInit() {
        this.subs.push(this.navController.pushEvent$.subscribe((component: any) => {
            const length = this.views.length;
            if (length) {
                let lastView = this.views[length - 1];
                lastView.state = ViewState.ToStack;
                this.views.push({
                    state: ViewState.Activate,
                    component
                });
            } else {
                this.views.push({
                    state: null,
                    component
                });
            }
        }));
        this.subs.push(this.navController.popEvent$.subscribe(() => {
            const length = this.views.length;
            if (length) {
                this.views[length - 1].state = ViewState.Destroy;

                if (length > 1) {
                    this.views[length - 2].state = ViewState.Reactivate;
                }
            }
        }));
        this.subs.push(this.popAction$.subscribe(() => {
            this.views.pop();
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    animationEnd(event: any) {
        if (event.animationName === 'view-status-content-destroy') {
            console.log(333);
            this.popActionSource.next();
        }
    }
}