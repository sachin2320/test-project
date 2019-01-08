
import { Pipe, PipeTransform } from "@angular/core";
import { DecimalType } from "app/enums/decimal-conversion-enum";
import { CurrencyPipe } from "@angular/common";

const Padding = "000000";

@Pipe({ name: "decimalPipe" })
/* Componenet to convert/transform input value to 2 decimal palces and add $ or %  as per DecimalType*/
export class DecimalPipe implements PipeTransform {

    private decimalSeparator: string;
    private thousandSeparator: string;

    constructor(public currencyPipe: CurrencyPipe) {
        this.decimalSeparator = ".";
        this.thousandSeparator = ",";
    }

    transform(value: number | string, conversionType: number = DecimalType.None): string {
        let fractionSize: number = 2;
        let [integer, fraction = ''] = (value || '').toString()
            .split(this.decimalSeparator);
        if (value == null) {
            return '';
        }
        else {
            fraction = fractionSize > 0
                ? this.decimalSeparator + (fraction + Padding).substring(0, fractionSize)
                : '';

            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
            if (integer == '') { integer = '0'; }
            let returnValue: string = integer + fraction;
            if (conversionType == DecimalType.Currency) {
                let index = returnValue.indexOf('-');
                if (index >= 0)
                    returnValue = returnValue.replace('-', '-$');
                else
                    returnValue = '$' + returnValue;
            }
            else if (conversionType == DecimalType.Percentage)
                returnValue = returnValue + '%';

            //return conversionType == DecimalType.Currency ? "$" + returnValue : (conversionType == DecimalType.Percentage ? returnValue + "%" : returnValue);
            return returnValue;
        }
    }
}