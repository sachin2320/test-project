import { Directive, Input, DoCheck, EventEmitter, OnDestroy, HostListener } from '@angular/core';
declare var jQuery: any;

@Directive({
    selector: '[numericinput]'
})
/* Componenet to enter only numeric values  */
export class NumericInputDirective {
    @HostListener('keypress', ['$event'])
    HandleNumeric(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.charCode != 0) {
            if (!pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
    }
} 