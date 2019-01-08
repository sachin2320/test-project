import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConfig } from 'app/configuration/app.config';
import { DecimalType } from 'app/enums/decimal-conversion-enum';
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridRowModel } from "app/models/gridRow.model";
import { DecimalPipe } from 'app/shared/decimal.pipe';
import { PolicyModel } from '../../models/policy.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'fgl-grid',
    templateUrl: './grid.component.html'
})

export class GridComponent {

    @Input('datasource') dataSource: GridRowModel[] = [];
    @Input('columns') gridColumns: GridColumnModel[] = [];
    @Input('tableclasses') tableClasses: string = "";
    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('isproductlist') isProductList: boolean = false;
    @Input('product') product: string = "";
    @Input('baseclass') baseClass: string = "mdl-data-table";
    @Input('policy') policy: PolicyModel;
    @Output('onanchorclicked')
    onAnchorClicked = new EventEmitter();

    @Output('ontextboxvaluechanged')
    onTextBoxValueChanged = new EventEmitter();
    public DecimalType: DecimalType;
    public dateFormat: string;

    constructor(private decimalPipe: DecimalPipe,
        private datePipe: DatePipe,
        public config: AppConfig,
        private utility: UtilityService) {
        this.dateFormat = this.config.getConfig("date_format");
    }

    onLinkClicked(event: any) {
        this.onAnchorClicked.emit(event);
    }

    onTextBoxValueInput(event: any, rowData: any) {
        let columnIndex = event.currentTarget.getAttribute('cellIndex');
        let rowIndex = event.currentTarget.getAttribute('rowIndex');
        //update edited column value in data source
        let currentValue = event.currentTarget.value;
        this.dataSource[rowIndex].columns[columnIndex].value = currentValue;

        let isValidRate = true;
        this.dataSource.some(gridDataModel => {
            //Validate rate value for each row. column[1] is for rate column.
            let rateValue = gridDataModel.columns[1].value;
            if (rateValue != null) {
                isValidRate = this.validateRate(rateValue);
            }
            if (!isValidRate) {
                return true;
            }
        });

        this.onTextBoxValueChanged.emit({ Value: event.currentTarget.value, RowData: rowData, IsValidRate: isValidRate });
    }

    onTextBoxValueChange(event: any, rowData: any) {
        let columnIndex = event.currentTarget.getAttribute('cellIndex');
        let rowIndex = event.currentTarget.getAttribute('rowIndex');

        //update edited column value in data source
        event.currentTarget.value = this.utility.RemoveExtraDecimalAndLeadingZero(event.currentTarget.value);
        this.dataSource[rowIndex].columns[columnIndex].value = event.currentTarget.value;
        this.onTextBoxValueChanged.emit({ Value: event.currentTarget.value, RowData: rowData, IsValidRate: true });
    }

    validateRate(rateValue: any) {
        let indexOfDecimal = rateValue.indexOf('.');
        let indexOfZero = rateValue.indexOf('0');
        let decimalposition = indexOfDecimal + 1;

        if (indexOfDecimal != -1 && decimalposition == rateValue.length) {
            //for decimal values, . (dot) at the end of any value is invalid.
            return false;
        }
        else if (indexOfZero == 0 && rateValue > 0) {
            //for number values, leading zeros are invalid.
            return false;
        }
        return true;
    }


    renderColumnData(columnData: any) {
        let returnHtml = columnData.columnType == 1 ? (this.decimalPipe.transform(columnData.value, DecimalType.Currency))
            : columnData.columnType == 3 ? (this.datePipe.transform(columnData.value, this.dateFormat))
                : columnData.columnType == 5 ? (this.decimalPipe.transform(columnData.value, DecimalType.Percentage)) : columnData.value
        return returnHtml;
    }
}

