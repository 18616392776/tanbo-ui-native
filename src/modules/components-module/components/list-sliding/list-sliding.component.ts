import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListEventService } from '../list-item/list-event.service';
import { ListActivatedService } from '../list-item/list-activated.service';

@Component({
    selector: 'ui-list-sliding',
    templateUrl: './list-sliding.component.html'
})
export class ListSlidingComponent implements OnInit, OnDestroy {
    private subs: Array<Subscription> = [];
    private distanceX: number = 0;
    private refs: Array<ElementRef> = [];
    private isFocus = false;

    constructor(private listEventService: ListEventService,
                private elementRef: ElementRef,
                private listActivatedService: ListActivatedService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.subs.push(this.listEventService.listOptions$.subscribe((elementRef: ElementRef) => {
            this.refs.push(elementRef);
        }));
        this.subs.push(this.listActivatedService.activatedComponent$.subscribe((component: any) => {
            if (!this.isFocus) {
                this.distanceX = 0;
                this.renderer.setStyle(this.elementRef.nativeElement, 'transition-duration', '');
                this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateX(0px)`);
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    @HostListener('touchstart', ['$event'])
    touchstart(event: any) {
        this.isFocus = true;
        const touchPoint = event.touches[0];

        const startX = touchPoint.pageX;
        const startY = touchPoint.pageY;

        const element = event.target;
        const oldDistanceX = this.distanceX;
        const startTime = Date.now();

        let maxDistance = 0;

        this.refs.forEach((item: ElementRef) => {
            maxDistance += item.nativeElement.offsetWidth;
        });

        let isClick = true;
        let isScroll = true;

        this.renderer.setStyle(element, 'transition-duration', '0s');

        let unBindTouchEndFn: () => void;
        let unBindTouchCancelFn: () => void;

        let unBindTouchMoveFn = this.renderer.listen('document', 'touchmove', (moveEvent: any) => {
            isClick = false;
            const newTouchPoint = moveEvent.touches[0];

            const moveX = newTouchPoint.pageX;
            const moveY = newTouchPoint.pageY;

            if (isScroll && Math.abs(moveX - startX) < Math.abs(moveY - startY)) {
                unBindTouchCancelFn();
                unBindTouchMoveFn();
                unBindTouchEndFn();
                return;
            }

            this.distanceX = moveX - startX + oldDistanceX;
            if (this.distanceX > 0) {
                this.distanceX = 0;
            }
            if (this.distanceX < -maxDistance) {
                this.distanceX = -maxDistance;
            }

            this.renderer.setStyle(element, 'transform', `translateX(${this.distanceX}px)`);
            isScroll = false;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            return false;
        });

        const touchEndFn = function () {
            this.isFocus = false;
            const endTime = Date.now();
            let distance = oldDistanceX - this.distanceX;
            if (endTime - startTime < 100 && Math.abs(distance) > 20) {
                this.distanceX = distance < 0 ? 0 : -maxDistance;
            } else {
                this.distanceX = this.distanceX > maxDistance / -2 ? 0 : -maxDistance;
            }
            this.renderer.setStyle(element, 'transition-duration', '');
            this.renderer.setStyle(element, 'transform', `translateX(${this.distanceX}px)`);
            unBindTouchCancelFn();
            unBindTouchMoveFn();
            unBindTouchEndFn();
        }.bind(this);

        unBindTouchEndFn = this.renderer.listen('document', 'touchend', touchEndFn);
        unBindTouchCancelFn = this.renderer.listen('document', 'touchcancel', touchEndFn);

        setTimeout(() => {
            if (isClick) {
                unBindTouchCancelFn();
                unBindTouchMoveFn();
                unBindTouchEndFn();
            }
        }, 100);
    }
}