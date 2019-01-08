import { Component, Input } from '@angular/core';
import { ColumnType } from "app/enums/column-type.enum";
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { GridRowModel } from "app/models/gridRow.model";
import { PolicyGmwbStrategyModel } from "app/models/policyGmwbStrategy.model";


@Component({
    selector: 'policy-gmwb-strategy',
    templateUrl: './policy-gmwb-strategy.component.html'
})

export class PolicyGmwbStrategyComponent {
    @Input('model') model: PolicyGmwbStrategyModel[] = [];
    dataSource: GridRowModel[] = [];
    columns: GridColumnModel[] = [];

    constructor() {
    }

    ngOnInit() {
        this.setupGridData();
    }

    setupGridData() {
        this.columns.push(new GridColumnModel("InterestCreditingMethod", "Interest crediting method"));
        this.columns.push(new GridColumnModel("GmwbIncomeBase", "GMWB income base"));
        this.columns.push(new GridColumnModel("CurrentRates", "Current rates"));
        this.columns.push(new GridColumnModel("GauranteedRates", "Guaranteed rates"));
        this.columns.push(new GridColumnModel("UpcomingRates", "Upcoming rates"));

        this.model.forEach(element => {
            let rowData: GridDataModel[] = [];
            rowData.push(new GridDataModel(element.interestCreditingMethod, ColumnType.Text));
            rowData.push(new GridDataModel(element.gmwbIncomeBase, ColumnType.Currency, "right-align"));
            rowData.push(new GridDataModel(element.currentRates, ColumnType.Text));
            rowData.push(new GridDataModel(element.gauranteedRates, ColumnType.Text));
            rowData.push(new GridDataModel(element.upcomingRates, ColumnType.Text));
            this.dataSource.push(new GridRowModel(rowData));
        });
    }
}
