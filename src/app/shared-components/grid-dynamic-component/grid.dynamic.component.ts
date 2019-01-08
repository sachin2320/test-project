import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConfig } from 'app/configuration/app.config';
import { DecimalType } from 'app/enums/decimal-conversion-enum';
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridRowModel } from "app/models/gridRow.model";
import { DecimalPipe } from 'app/shared/decimal.pipe';
import { PolicyModel } from '../../models/policy.model';
import { PolicyTabInnerTableRowCell,DynamicField,TableHeader, TextAlign } from "app/models/dynamicPolicyInfo.model";
@Component({
    selector: 'fgl-dynamic-grid',
    templateUrl: './grid.dynamic.component.html'
})

export class GridDynamicComponent {

    @Input('datasource') dataSource: PolicyTabInnerTableRowCell[] = [];
    @Input('columns') gridColumns: TableHeader;
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
    private TextAlign =TextAlign;

    constructor(private decimalPipe: DecimalPipe, private datePipe: DatePipe, public config: AppConfig) {
       
        this.dateFormat = this.config.getConfig("date_format");
        
    }

    onLinkClicked(event: any) {
        this.onAnchorClicked.emit(event);
    }    

    onTextBoxValueChange(event: any, rowData: any) {        
        let columnIndex = event.currentTarget.getAttribute('cellIndex');
        let rowIndex = event.currentTarget.getAttribute('rowIndex');
        //update edited column value in data source
        let currentValue = event.currentTarget.value;
        this.dataSource[rowIndex].fieldProperty[columnIndex].value = currentValue;

        let isValidRate = true;       
        this.dataSource.some(gridDataModel => {
            //Validate rate value for each row. column[1] is for rate column.
            let rateValue = gridDataModel.fieldProperty[1].value; 
            if (rateValue != null) {
                isValidRate = this.validateRate(rateValue);               
            }
            if (!isValidRate) {
                return true;
            }
        });

        this.onTextBoxValueChanged.emit({ Value: event.currentTarget.value, RowData: rowData, IsValidRate: isValidRate });
    }

    validateRate(rateValue: any) {
        if (rateValue.indexOf('.') != -1) {
            //for decimal values, . (dot) at the end of any value is invalid.
            let indexOfDecimal = rateValue.indexOf('.') + 1;
            if (rateValue.length == indexOfDecimal) {
                return false;
            }
            else {
                return true;
            }
        }
        return true;
    }


    renderCell(cellData: any) {
       
        let returnHtml = cellData.fieldProperty.dataType == 1 ? (this.decimalPipe.transform(cellData.fieldProperty.displayLabel, DecimalType.Currency))
            : cellData.fieldProperty.dataType == 3 ? (this.datePipe.transform(cellData.fieldProperty.displayLabel, this.dateFormat))
                : cellData.fieldProperty.dataType == 5 ? (this.decimalPipe.transform(cellData.fieldProperty.displayLabel, DecimalType.Percentage)) : cellData.fieldProperty.displayLabel
        
                return returnHtml;
    }
}

