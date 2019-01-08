import { Component, OnInit } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";
import { ColumnType } from "app/enums/column-type.enum";
import { LobType } from "app/enums/lob-type.enum";
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { GridRowModel } from "app/models/gridRow.model";
import { PolicyModel } from "app/models/policy.model";
import { PolicyService } from "app/services/policy/policy.service";
import { SnackbarService } from "app/shared-services/snackbar.service";

@Component({
  selector: 'policy-list',
  styles: [],
  templateUrl: './policy-list.component.html'
})

export class PolicyListComponent implements OnInit {
  dateFormat: string;
  isDataloadCompleted: boolean = false;

  lifeDataSource: GridRowModel[] = [];
  lifeColumns: GridColumnModel[] = [];

  annuityDataSource: GridRowModel[] = [];
  annuityColumns: GridColumnModel[] = [];

  constructor(private polListService: PolicyService,    
    public config: AppConfig,
    private notification: SnackbarService,
 ) {
    this.dateFormat = this.config.getConfig("date_format");
  }

  ngOnInit() {

    this.polListService.getPolicyList(PolicyUsageIndicator.Home)
      .subscribe(results => {
        this.isDataloadCompleted = true;
        this.populatePolicyGridData(results.annuityPolicies, this.annuityDataSource, this.annuityColumns, LobType.Annuity)
        this.populatePolicyGridData(results.lifePolicies, this.lifeDataSource, this.lifeColumns, LobType.Life)
      },
        error => {
          this.isDataloadCompleted = true;
          this.notification.popupSnackbar(error);
        });
  }

  populatePolicyGridData(dataModel: PolicyModel[], gridDataSource: GridRowModel[], gridColumn: GridColumnModel[], lobType: LobType) {

    if (dataModel != null && dataModel != undefined && dataModel.length > 0) {
      gridColumn.push(new GridColumnModel("policyNumber", "Policy number", "col-width-sm"));
      gridColumn.push(new GridColumnModel("productName", "Product", "col-width-lg"));
      gridColumn.push(new GridColumnModel("status", "Status", "col-width-sm"));
      if (lobType == LobType.Annuity) {
        gridColumn.push(new GridColumnModel("accountValue", "Account value", "col-width-md"));
        gridColumn.push(new GridColumnModel("netSurrenderAmount", "Surrender value", "col-width-md"));
      }
      else {
        gridColumn.push(new GridColumnModel("deathBenefitAmount", "Death benefit", "col-width-md"));
        gridColumn.push(new GridColumnModel("netSurrenderAmount", "Surrender value", "col-width-md"));
      }

      dataModel.forEach(element => {
        let rowData: GridDataModel[] = [];
        let polType = lobType == LobType.Life ? 'L' : 'A';
        let url = this.config.getConfig('appPolicyViewUrl') + "/{0}/{1}".replace("{0}", element.policyNumber).replace("{1}", polType);
        if (element.tooltipId) {
          rowData.push(new GridDataModel(element.policyNumber, ColumnType.Text,
            "numeric first-col-policy-width", "", (element.canPolicyDetailView ? url : ""),
            "", null, null, "", element.tooltipId));
        } else {
          rowData.push(new GridDataModel(element.policyNumber, ColumnType.Text, "numeric first-col-policy-width", "", (element.canPolicyDetailView ? url : "")));
        }
        rowData.push(new GridDataModel(element.productName, ColumnType.Text));
        rowData.push(new GridDataModel(element.statusDesc, ColumnType.Text));
        if (lobType == LobType.Annuity) {
          if (element.tooltipId == 'tooltipMonthEndUnavailable') {
            rowData.push(new GridDataModel("Not currently available", ColumnType.Text, "right-align-ignore"));
            rowData.push(new GridDataModel("Not currently available", ColumnType.Text, "right-align-ignore"));
          } else {
            rowData.push(new GridDataModel(element.accountValue, ColumnType.Currency, "right-align-ignore"));
            rowData.push(new GridDataModel(element.netSurrenderValue, ColumnType.Currency, "right-align-ignore"));
          }
        }
        else {
          rowData.push(new GridDataModel(element.deathBenefits, ColumnType.Currency, "right-align-ignore"));
          rowData.push(new GridDataModel(element.netSurrenderValue, ColumnType.Currency, "right-align-ignore"));
        }
        gridDataSource.push(new GridRowModel(rowData));
      });
    }
  }
}
