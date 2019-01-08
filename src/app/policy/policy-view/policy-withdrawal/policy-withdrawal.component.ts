import { Component, Input } from "@angular/core";
import { WithdrawalModel } from "app/models/withdrawal.model";
import { GridRowModel } from "app/models/gridRow.model";
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { ColumnType } from "app/enums/column-type.enum";

@Component({
    selector: 'policy-withdrawal',
    templateUrl: './policy-withdrawal.component.html'
})

export class PolicyWithdrawalComponent {

    @Input('model') model: WithdrawalModel;
    dataSource: GridRowModel[] = [];
    columns: GridColumnModel[] = [];

    constructor() {
    }

    ngOnInit() {
        this.setupGridData();
    }

    setupGridData() {
        let rowData1: GridDataModel[] = [];
        rowData1.push(new GridDataModel("Gross Withdrawal YTD", ColumnType.Text, "header-as-firstColumn"));
        rowData1.push(new GridDataModel(this.model.grossWithdrawalYtdAmt, ColumnType.Currency, "right-align"));
        this.dataSource.push(new GridRowModel(rowData1));

        let rowData2: GridDataModel[] = [];
        rowData2.push(new GridDataModel("Net Withdrawal Ytd", ColumnType.Text, "header-as-firstColumn"));
        rowData2.push(new GridDataModel(this.model.netWithdrawalYtdAmt, ColumnType.Currency, "right-align"));
        this.dataSource.push(new GridRowModel(rowData2));

        let rowData3: GridDataModel[] = [];
        rowData3.push(new GridDataModel("Gross Withdrawal Since Inception", ColumnType.Text, "header-as-firstColumn"));
        rowData3.push(new GridDataModel(this.model.grossWithdrawalSinceInceptionAmt, ColumnType.Currency, "right-align"));
        this.dataSource.push(new GridRowModel(rowData3));

        let rowData4: GridDataModel[] = [];
        rowData4.push(new GridDataModel("Net Withdrawal Since Inception", ColumnType.Text, "header-as-firstColumn"));
        rowData4.push(new GridDataModel(this.model.netWithdrawalSinceInceptionAmt, ColumnType.Currency, "right-align"));
        this.dataSource.push(new GridRowModel(rowData4));
    }
}