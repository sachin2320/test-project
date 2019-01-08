import { Component, Input } from '@angular/core';
import { AllocationInfoPremiumModel } from "app/models/allocationInfoPremium.model";
import { GridRowModel } from "app/models/gridRow.model";
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { ColumnType } from "app/enums/column-type.enum";

@Component({
    selector: 'policy-incoming-premium',
    templateUrl: './policy-incoming-premium.component.html'
})

export class PolicyIncomingPremiumComponent {
    @Input('model') model: AllocationInfoPremiumModel[]=[];
    dataSource: GridRowModel[] = [];
    columns: GridColumnModel[] = [];

    constructor() {
    }

    ngOnInit() {
        this.setupGridData();
    }

    setupGridData() {
         let rowColumns: GridDataModel[] = [];

        this.columns.push(new GridColumnModel("interestCreditingMethod", "Interest crediting method")); 
        this.columns.push(new GridColumnModel("allocation", "Allocation %"));
        
        this.model.forEach(element => {
            let rowData: GridDataModel[] = [];
            rowData.push(new GridDataModel(element.interestCreditingMethod, ColumnType.Text));
            rowData.push(new GridDataModel(element.allocation, ColumnType.Number));           
            this.dataSource.push(new GridRowModel(rowData));
        });        
    }
}