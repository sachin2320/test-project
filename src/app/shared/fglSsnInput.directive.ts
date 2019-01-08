import { Directive, Input, DoCheck, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[fglssninput]'
})
/*Component to mask fgl SSN input values.
Usage: Add "fglssninput" into text input html and provide value like fglssninput="***-**-"
*/
export class FglSsnInputDirective {
    @Input('fglssninput') fglssninput: string;
    @HostListener('blur', ['$event'])
    @HostListener('focus', ['$event'])
    HandleUserInput(event: any) {
        let maskingSpanClass = "maskingSpan" + event.target.id;
        let spanElement = event.target.parentElement.getElementsByClassName(maskingSpanClass);
        if (spanElement.length == 0) {
            $(event.target.parentElement).append("<span class='" + maskingSpanClass + "'></span>");
            spanElement = event.target.parentElement.getElementsByClassName(maskingSpanClass);
        }
        $(spanElement[0]).css({
            'position': 'absolute',
            'top': '2px',
            'background-color': 'rgb(255, 255, 255)',
            'width': '100%'
        });
        let maskedInputString = this.fglssninput;
        let inputString = event.target.value;
        let nonMaskedInputString = "";
        let maskingCharacter = "*";
        let numberOfCharactersNotToMask = 4;
        let truncatedInputString = "";
        if (event.type == 'blur') {
            spanElement[0].style.display = 'block';

            let valueNotToMask = inputString.substr(inputString.length - numberOfCharactersNotToMask);
            let valueToMask = inputString.substr(0, inputString.length - (numberOfCharactersNotToMask));
            valueToMask = valueToMask.replace(/[a-zA-Z0-9]/g, maskingCharacter);
            spanElement[0].innerHTML = valueToMask + valueNotToMask;
            event.target.value = inputString;
        }
        else if (event.type == 'focus') {
            spanElement[0].style.display = 'none';
        }       
    }
} 