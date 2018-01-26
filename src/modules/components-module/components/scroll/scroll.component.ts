import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    Input,
    Inject,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';

import { PullDownRefreshController } from '../../controllers/pull-down-refresh-controller';
import { UI_DO_LOAD_DISTANCE, PullUpLoadController } from '../../controllers/pull-up-load-controller';

@Component({
    selector: 'ui-scroll',
    templateUrl: './scroll.component.html'
})
export class ScrollComponent implements AfterViewInit, OnDestroy, OnInit {
    // 是否开启下拉刷新
    @Input()
    openRefresh: boolean = false;
    // 是否开启下拉刷新
    @Input()
    openInfinite: boolean = false;

    @HostBinding('style.transform')
    transform: string;

    private sub: Subscription;
    private distanceY: number = 0;
    private unBindFnList: Array<() => void> = [];

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef,
                @Inject(UI_DO_LOAD_DISTANCE) private doLoadDistance: number,
                private pullUpLoadController: PullUpLoadController,
                private pullDownRefreshController: PullDownRefreshController) {

    }

    ngOnInit() {
        this.sub = this.pullDownRefreshController.onStateChange.subscribe(n => {
            this.distanceY = n;
            this.transform = `translateY(${n}px)`;
        });
    }

    ngAfterViewInit() {
        if (this.openRefresh) {
            this.bindingRefresher();
        }

        if (!this.openInfinite) {
            return;
        }

        const element = this.elementRef.nativeElement;

        this.unBindFnList.push(this.renderer.listen(element, 'scroll', () => {
            // 计算最大滚动距离
            const maxScrollY = Math.max(element.scrollHeight, element.offsetHeight) - element.offsetHeight;
            // 如果当前滚动距离小于上拉刷新临界值，则记录相应值，并就广播相应事件
            if (maxScrollY - element.scrollTop < this.doLoadDistance) {
                this.pullUpLoadController.loading();
            }
        }));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.unBindFnList.forEach(item => item());
    }

    bindingRefresher() {
        const element = this.elementRef.nativeElement;

        this.renderer.listen(element, 'touchstart', (ev: any) => {
            const startPoint = ev.touches[0];
            const startX = startPoint.pageX;
            const startY = startPoint.pageY;

            const scrollY = element.scrollTop;
            const oldDistanceY = this.distanceY;

            let unBindTouchMoveFn: () => void;
            let unBindTouchEndFn: () => void;
            let unBindTouchCancelFn: () => void;

            const unBindFn = () => {
                unBindTouchMoveFn();
                unBindTouchEndFn();
                unBindTouchCancelFn();
                this.pullDownRefreshController.dragEnd();
            };

            let isFirstTouching: boolean = true;

            unBindTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
                const movePoint = ev.touches[0];
                const moveX = movePoint.pageX;
                const moveY = movePoint.pageY;

                const distanceX = moveX - startX;
                const distanceY = moveY - startY;

                if (Math.abs(distanceX) > Math.abs(distanceY) && isFirstTouching) {
                    unBindFn();
                    return;
                }
                isFirstTouching = false;

                const result = distanceY - scrollY ;
                const n = result / 3;
                if (result >= 0) {
                    this.pullDownRefreshController.drag(n);
                    return;
                }

                if (distanceY <= 0) {
                    const a = oldDistanceY + distanceY / 3;
                    if (a <= oldDistanceY && a >= 0) {
                        this.pullDownRefreshController.drag(a - oldDistanceY);
                        ev.preventDefault();
                        return false;
                    }
                }
                // this.pullDownRefreshController.drag(this.distanceY < oldDistanceY ? -oldDistanceY : 0);
            });

            unBindTouchEndFn = this.renderer.listen('document', 'touchend', unBindFn);
            unBindTouchCancelFn = this.renderer.listen('document', 'touchcancel', unBindFn);
        });
    }
}