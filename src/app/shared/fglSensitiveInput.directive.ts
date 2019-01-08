import { Directive, Input, DoCheck, OnInit, ElementRef, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[fglsensitiveinput]'
})
/*Component to mask fgl sensitive input values.
Usage: Add "fglsensitiveinput" into text input html*/
export class FglSensitiveInputDirective implements DoCheck {
    private el: HTMLInputElement;
    private isLoaded: boolean = false;

    @Input('fglsensitiveinput') config: {
        cssClass: ''
    }

    constructor(private elementRef: ElementRef,
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngDoCheck() {
        if (this.el.value != '' && !this.isLoaded) {
            this.MaskValue(this.el, 'load');
        }
        else if (!this.el.value) {
            let maskingSpanClass = "maskingSpan" + this.el.id;
            let spanElement = this.el.parentElement.getElementsByClassName(maskingSpanClass);
            $(spanElement).hide();
        }
    }

    @HostListener('blur', ['$event'])
    @HostListener('focus', ['$event'])

    HandleUserInput(event: any) {
        this.MaskValue(event.target, event.type);
    }

    MaskValue(element, event) {
        let maskingSpanClass = "maskingSpan" + element.id;
        let spanElement = element.parentElement.getElementsByClassName(maskingSpanClass);
        let cssClass = this.config.cssClass;

        if (spanElement.length == 0) {
            $(element.parentElement).append("<span class='" + maskingSpanClass + " " + cssClass + "'></span>");
            spanElement = element.parentElement.getElementsByClassName(maskingSpanClass);
        }

        $(spanElement[0]).css({
            'position': 'absolute',
            'top': '2px',
            'background-color': 'rgb(255, 255, 255)',
            'width': '100%',
            'pointer-events': 'none'
        });

        let inputString = element.value;
        let maskingCharacter = "*";

        if (event.toLowerCase() == 'blur' || event.toLowerCase() == 'load') {
            spanElement[0].style.display = 'block';
            let valueToMask = inputString.replace(/./g, maskingCharacter);
            spanElement[0].innerHTML = valueToMask;
            element.value = inputString;
        }
        else if (event.toLowerCase() == 'focus') {
            spanElement[0].style.display = 'none';
        }
        this.isLoaded = true;
    }
} 