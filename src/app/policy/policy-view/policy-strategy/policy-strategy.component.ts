import { Component, Input } from '@angular/core';
import { StrategyLevelDetailModel } from "app/models/strategyLevelDetail.model";
import { GridRowModel } from "app/models/gridRow.model";
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { ColumnType } from "app/enums/column-type.enum";


@Component({
    selector: 'policy-strategy',
    templateUrl: './policy-strategy.component.html'
})

export class PolicyStrategyComponent {
    @Input('model') model: StrategyLevelDetailModel[] = [];
    dataSource: GridRowModel[] = [];
    columns: GridColumnModel[] = [];

    constructor() {
    }

    ngOnInit() {
        this.setupGridData();
    }

    setupGridData() {
        this.columns.push(new GridColumnModel("InterestCreditingMethod", "Interest crediting method"));
        this.columns.push(new GridColumnModel("AccountValue", "Account Value"));
        this.columns.push(new GridColumnModel("CashSurrenderValue", "Cash Surrender value"));

        this.model.forEach(element => {
            let rowData: GridDataModel[] = [];
            rowData.push(new GridDataModel(element.interestCreditingMethod, ColumnType.Text));
            rowData.push(new GridDataModel(element.accountValue, ColumnType.Currency, "right-align"));
            rowData.push(new GridDataModel(element.cashSurrenderValue, ColumnType.Currency, "right-align"));
            this.dataSource.push(new GridRowModel(rowData));
        });
    }
}