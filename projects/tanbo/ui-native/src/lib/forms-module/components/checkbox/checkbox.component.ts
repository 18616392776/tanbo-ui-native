import { Component, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ui-input[type=checkbox]',
    templateUrl: './checkbox.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: CheckboxComponent,
        multi: true
    }]
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input()
    name: string = '';
    @Input()
    text: string = '';
    @Input()
    value: string = '';
    @Input()
    forId: string = '';
    @Input()
    @HostBinding('class.ui-disabled')
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        const isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    @Input()
    @HostBinding('class.ui-readonly')
    set readonly(isReadonly: any) {
        this._readonly = isReadonly;
    }

    get readonly() {
        const isReadonly = (this as any).hasOwnProperty('_readonly');
        return isReadonly && this._readonly !== false;
    }

    @Input()
    @HostBinding('class.ui-checked')
    set checked(isChecked: any) {
        this._checked = isChecked;
    }

    get checked() {
        const isChecked = (this as any).hasOwnProperty('_checked');
        return isChecked && this._checked !== false;
    }

    @Input()
    checkedIcon: string = 'ui-icon-checkbox-checked';
    @Input()
    uncheckedIcon: string = 'ui-icon-checkbox-unchecked';

    @Output()
    change = new EventEmitter<boolean>();

    private _disabled: boolean = false;
    private _readonly: boolean = false;
    private _checked: boolean = false;

    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;

    @HostListener('click')
    click() {
        if (this.disabled || this.readonly) {
            return;
        }
        this.checked = !this.checked;
        if (this.onChange) {
            this.onChange(this.checked);
        }
        if (this.onTouched) {
            this.onTouched(this.checked);
        }
        this.change.emit(this.checked);
    }

    writeValue(value: any) {
        this.checked = !!value;
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