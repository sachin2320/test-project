
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "fullNumberMaskingPipe" })
/* Componenet to mask input value  */
export class FullNumberMaskingPipe implements PipeTransform {

    private maskingCharacter: string;

    constructor() {
        this.maskingCharacter = "*";
    }

    transform(value: string): string {
        let valueToMask = (value || "");
        if (valueToMask != "") {
            valueToMask = valueToMask.replace(/[a-zA-Z0-9]/g, this.maskingCharacter);
        }

        return valueToMask;
    }
}