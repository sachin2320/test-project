import { Directive, Input, DoCheck, EventEmitter, OnDestroy, HostListener } from '@angular/core';
declare var jQuery: any;

@Directive({
    selector: '[numericwithspecialcharinput]'
})
/* Componenet to enter numeric values with specific sepecial characters. Used in date, phone fields etc.  */
export class NumericWithSpecialCharInputDirective {
    @Input('numericwithspecialcharinput') charOptions: string;
    private initialregex: string = "[0-9";
    regex: string;

    constructor() { }

    @HostListener('keypress', ['$event'])
    HandleNumeric(event: any) {
        //Creating regex dynamically
        if (this.charOptions != undefined && this.charOptions != "") {
            let chars = this.charOptions.split(',');
            this.regex = this.initialregex;
            chars.forEach(element => {
                this.regex += element;
            });
            this.regex += "]";
        }
        //test the pattern
        const pattern = RegExp(this.regex);
        let inputChar = String.fromCharCode(event.charCode);
        if (event.charCode != 0) {
            if (!pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
    }
} 