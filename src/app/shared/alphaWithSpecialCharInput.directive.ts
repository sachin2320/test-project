import { Directive, Input, DoCheck, EventEmitter, OnDestroy, HostListener } from '@angular/core';
declare var jQuery: any;

@Directive({
    selector: '[alphawithspecialcharinput]'
})
/* Componenet to enter numeric values with specific sepecial characters. Used in date, phone fields etc.  */
export class AlphaWithSpecialCharInputDirective {
    @Input('alphawithspecialcharinput') charOptions: string;
    private initialregex: string = "[a-zA-Z";
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