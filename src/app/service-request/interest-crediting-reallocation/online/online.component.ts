import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ColumnType } from "app/enums/column-type.enum";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { GridRowModel } from "app/models/gridRow.model";
import { PolicyInterestCreditOptionModel } from "app/models/policyInterestCreditOption.model";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";

@Component({
    selector: 'interest-crediting-reallocation',
    styles: [],
    templateUrl: './online.component.html'
})

export class InterestCreditingReallocationComponent implements OnInit {

    @Input('isviewonly') isViewOnly: boolean = false;

    public errorMessage: string = "";
    public policyNumber = "";

    public model: PolicyInterestCreditOptionModel[] = [];

    public dataSource: GridRowModel[] = [];
    public columns: GridColumnModel[] = [];
    public isValidRate: boolean;


    @Output('onvaluechanged')
    formValue = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private notification: SnackbarService,
        private spinner: SpinnerService,
        private serviceRequestService: ServiceRequestService) {
           
        var queryParam = this.route.snapshot.params;
        if (queryParam) {
            this.policyNumber = this.route.snapshot.params.PolicyNumber || "";
        }
    }

    ngOnInit() {
        this.getInterestCreditOptionData();
        //Raising invalid form state event.
        this.formValue.emit({ FormData: this.model });
    }

    getInterestCreditOptionData() {
        this.spinner.start();
        this.serviceRequestService.getServiceRequestInterestCredit(this.policyNumber)
            .subscribe(res => {
                if (res.isSuccess) {
                    this.model = res.data.interestCredit;
                    this.setupGridData();
                }
                else {
                    this.setUpError(res.message);
                }
            },
                error => {
                    this.setUpError(error);
                });
    }

    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }

    setupGridData() {
        let rowColumns: GridDataModel[] = [];

        //this.columns.push(new GridColumnModel("associateIndex", "Associated index")); ==> Do not remove this commented code
        this.columns.push(new GridColumnModel("option", "Interest crediting method"));
        this.columns.push(new GridColumnModel("rate", "%"));

        if (this.model != null && this.model.length > 0) {
            this.model.forEach(element => {
                element.rate = null;
                if (element.isOpen) {
                    let rowData: GridDataModel[] = [];
                    //rowData.push(new GridDataModel(element.associateIndex, ColumnType.Text)); ==> Do not remove this commented code
                    rowData.push(new GridDataModel(element.option, ColumnType.Text, "normal-whitespace"));
                    rowData.push(new GridDataModel(element.rate, ColumnType.TextBox, "width100px"));
                    this.dataSource.push(new GridRowModel(rowData));
                }
            });
        }
        else {
            let rowData: GridDataModel[] = [];
            rowData.push(new GridDataModel("None", ColumnType.Text));
            rowData.push(new GridDataModel("", ColumnType.Text));
            this.dataSource.push(new GridRowModel(rowData));
        }
        this.spinner.stop();
    }


    emitResult() {
        let result = {
            RequestType: ServiceRequestType.ChangeName,
            IcrData: { Data: JSON.stringify(this.model) },
            IsDataValid: this.isValidRate ? this.isInterestCreditOptionValid : this.isValidRate,
            UserComment: ""
        };
        this.formValue.emit(result);
    }

    get interestCreditOption(): number {
        return this.calculatePercentage();
    }

    get isInterestCreditOptionValid(): boolean {
        let result = (this.calculatePercentage() == 100);
        return result;
    }

    private calculatePercentage(): number {
        let totalInterestCredit: number = 0;
        let formValue = this.dataSource;

        formValue.forEach(form => {
            totalInterestCredit = totalInterestCredit + Number(form.columns[1].value); //form.column[1] is rate column
        });

        return totalInterestCredit % 1 === 0 ? totalInterestCredit : parseFloat(totalInterestCredit.toFixed(2));
    }

    onRateChange(event: any) {
        //here we are using Interest crediting method column for comaprison as it has unique values.
        let option = event.RowData.columns[0].value;
        let filterResult = this.model.filter(x => x.option == option);
        if (filterResult.length > 0) {
            filterResult[0].rate = Number(event.Value);
        }
        this.isValidRate = event.IsValidRate;
        this.emitResult();
    }
}