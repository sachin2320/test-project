
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "numberMaskingPipe" })
/* Componenet to mask input value except last four characters. */
export class NumberMaskingPipe implements PipeTransform {

    private maskingCharacter: string;
    private numberOfCharactersNotToMask: number;

    constructor() {
        this.maskingCharacter = "*";
        this.numberOfCharactersNotToMask = 4;
    }

    transform(value: string): string {
        let valueToMask = (value || "");
        let valueNotToMask: string = "";
        if (valueToMask != "" && valueToMask.length >= this.numberOfCharactersNotToMask) {
            valueNotToMask = valueToMask.substr(valueToMask.length - this.numberOfCharactersNotToMask);
            valueToMask = valueToMask.substr(0, valueToMask.length - (this.numberOfCharactersNotToMask));
            valueToMask = valueToMask.replace(/[a-zA-Z0-9]/g, this.maskingCharacter);
        }
       
        return valueToMask + valueNotToMask;
    }
}