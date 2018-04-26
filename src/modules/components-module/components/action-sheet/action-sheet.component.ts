import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

import { ActionSheetService } from './action-sheet.service';

@Component({
    selector: 'ui-action-sheet',
    templateUrl: './action-sheet.component.html'
})
export class ActionSheetComponent implements OnInit {
    @Input()
    set show(value: boolean) {
        clearTimeout(this.timer);
        if (value) {
            this._show = value;
            this.timer = setTimeout(() => {
                this.isPopUp = value;
            }, 20);
        } else {
            this.isPopUp = value;
            this.timer = setTimeout(() => {
                this._show = value;
            }, 300);
        }
    }

    get show() {
        return this._show;
    }

    @ViewChild('mask')
    mask: ElementRef;

    isPopUp: boolean = false;

    private _show: boolean = false;
    private timer: any = null;

    constructor(private actionSheetService: ActionSheetService) {
    }

    ngOnInit() {
        this.actionSheetService.show(this.mask.nativeElement);
    }
}