import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiSwipeRight]'
})
export class SwipeRightDirective implements OnInit, OnDestroy {
    @Output()
    uiSwipeRight = new EventEmitter<any>();

    @Input()
    uiSwipeRightOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiSwipeRightOptions);
        this.hammerInstance.on('swiperight', (event: any) => {
            this.uiSwipeRight.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('swiperight');
    }
}