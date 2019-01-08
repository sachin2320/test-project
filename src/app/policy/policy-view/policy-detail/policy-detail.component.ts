import { Component, Input } from "@angular/core";
import { AppConfig } from "app/configuration/app.config";
import { DecimalType } from "app/enums/decimal-conversion-enum";
import { DynamicPolicyInfoModel, FieldPropertyModel, PolicyType, TextAlign } from "app/models/dynamicPolicyInfo.model";


@Component({
    selector: 'policy-detail',
    templateUrl: './policy-detail.component.html'
})

export class PolicyDetailComponent {
    @Input('model') model: DynamicPolicyInfoModel = null;
    @Input('product') product: string = null;

    public dateFormat: string;
    public columns: Column[] = [];
    public DecimalType = DecimalType; 

    constructor(public config: AppConfig) {
        this.dateFormat = this.config.getConfig("date_format");
        if (this.model == null)
            this.model = new DynamicPolicyInfoModel();
    }

    ngOnInit() {
        this.populatePolicyDetails(); 
    }

    populatePolicyDetails() {
        let isLifePolicy: boolean = this.model.type == PolicyType.LIFE;

        let items = this.model.dynamicFields.sort((n1, n2) => n1.columnNumber - n2.columnNumber);

        let columnNumber: number = -1;
        let column: Column;

        for (let i: number = 0; i < items.length; i++) {
            if (items[i].columnNumber !== columnNumber) {
                columnNumber = items[i].columnNumber;
                if (column)
                    this.columns.push(Object.assign({}, column));
                column = new Column();
            }
            column.policyDetailModels.push(new FieldPropertyModel(items[i].displayLabel,
                items[i].displayValue,
                items[i].dataType,
                items[i].tooltipText,
                items[i].displayLabelAlign ? (TextAlign[items[i].displayLabelAlign].toLowerCase()) : '',
                items[i].displayValueAlign ? (TextAlign[items[i].displayValueAlign].toLowerCase()) : ''))
        }
        if (column)
            this.columns.push(Object.assign({}, column));
    }
}

export class Column {
    constructor(public policyDetailModels: FieldPropertyModel[] = []) {
    }
}
