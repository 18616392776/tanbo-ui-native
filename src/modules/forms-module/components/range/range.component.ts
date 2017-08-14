import { Component, Input, HostBinding, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ui-input[type=range]',
    templateUrl: './range.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: RangeComponent,
        multi: true
    }]
})
export class RangeComponent implements ControlValueAccessor {
    @Input()
    name: string;
    @Input()
    forId: string;

    @ViewChild('rangeBar')
    rangeBar: ElementRef;

    @Input()
    @HostBinding('class.disabled')
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        let isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    @Input()
    @HostBinding('class.readonly')
    set readonly(isReadonly: any) {
        this._readonly = isReadonly;
    }

    get readonly() {
        let isReadonly = (this as any).hasOwnProperty('_readonly');
        return isReadonly && this._readonly !== false;
    }

    @Input()
    set min(min: any) {
        let v = RangeComponent.toNumber(min);
        if (!isNaN(v)) {
            this._min = v;
        }
    }

    get min() {
        return this._min;
    }

    @Input()
    set max(max: any) {
        let v = RangeComponent.toNumber(max);
        if (!isNaN(v)) {
            this._max = v;
        }
    }

    get max() {
        return this._max;
    }

    @Input()
    set step(step: any) {
        let v = RangeComponent.toNumber(step);
        if (!isNaN(v)) {
            this._step = v;
        }
    }

    get step() {
        return this._step;
    }

    @Input()
    set value(value: any) {
        let v = RangeComponent.toNumber(value);
        if (!isNaN(v)) {
            this._value = v;
            if (this.min <= this.max) {
                if (v < this.min) {
                    v = this.min;
                } else if (v > this.max) {
                    v = this.max;
                }
                this.position = (v - this.min) / (this.max - this.min) * 100;
            }
        }
    }

    get value() {
        return this._value;
    }

    @Input()
    checkedIcon: string;
    @Input()
    uncheckedIcon: string;

    position: number = 50;

    @Output()
    change = new EventEmitter<string>();

    @ViewChild('rawInput')
    rawInput: ElementRef;

    private _disabled: boolean;
    private _readonly: boolean;
    private _min: number = 0;
    private _max: number = 100;
    private _step: number = 1;
    private _value: number = 50;

    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;

    static toNumber(value: any): number {
        if (typeof value === 'number') {
            return value;
        }
        return Number(value);
    }

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {

    }

    drag(event: any) {
        if (this.readonly || this.disabled) {
            return;
        }
        if (this.min >= this.max) {
            return;
        }
        let section = this.max - this.min;
        let maxWidth = this.elementRef.nativeElement.offsetWidth;
        let nowWidth = this.rangeBar.nativeElement.offsetWidth;

        let eventType = event.type;
        let moveEventType: string = '';
        let endEventType: string = '';
        let oldX: number;
        if (eventType === 'mousedown') {
            moveEventType = 'mousemove';
            endEventType = 'mouseup';
            oldX = event.clientX;
        } else if (eventType === 'touchstart') {
            moveEventType = 'touchmove';
            endEventType = 'touchend';
            oldX = event.touches[0].clientX;
        }

        function move(ev: any) {

            let dragDistance: number = 0;
            if (eventType === 'mousedown') {
                dragDistance = ev.clientX - oldX;
            } else if (eventType === 'touchstart') {
                dragDistance = ev.touches[0].clientX - oldX;
            }
            let proportion = (nowWidth + dragDistance) / maxWidth;
            let temporaryValue = Math.floor(section * proportion / this.step) * this.step;

            let value = this.min + temporaryValue;
            if (value < this.min) {
                value = this.min;
            } else if (value > this.max) {
                value = this.max - (this.max - this.min) % this.step;
            }

            this.value = value;
            if (this.onChange) {
                this.onChange(value);
            }
            if (this.onTouched) {
                this.onTouched(value);
            }
            this.change.emit(value);
        }

        let moveUnbindFn = this.renderer.listen('document', moveEventType, move.bind(this));
        let upUnbindFn = this.renderer.listen('document', endEventType, () => {
            moveUnbindFn();
            upUnbindFn();
        });
    }

    writeValue(value: any) {
        this.value = value;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}