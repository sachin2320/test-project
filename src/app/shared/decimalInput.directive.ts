import { Directive, HostListener } from '@angular/core';
declare var jQuery: any;

@Directive({
    selector: '[decimalinput]'
})
/* Component to enter only numeric values  */
export class DecimalInputDirective {
    @HostListener("keypress", ["$event"])
    onKeyPress(event: any) {
        const pattern = /[0-9\.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.charCode != 0) {
            if (!pattern.test(inputChar)) {
                event.preventDefault();
            }
            else {
                let inputValue = event.target.value;
                if (inputValue.indexOf(".") > -1) {
                    let fractionValue = inputValue.substring(inputValue.indexOf("."));
                    let currentCursorPosition = event.target.selectionStart;
                    if (fractionValue.length > 2 && currentCursorPosition > inputValue.indexOf(".")) {
                        event.preventDefault();
                    }
                }
            }
        }
    }
} 