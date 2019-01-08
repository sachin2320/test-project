import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { KeyValueModel } from 'app/models/keyValue.model';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { ServiceRequestService } from 'app/services/service-request/service-request.service';
import { SpinnerService } from 'app/shared-services/spinner.service';

@Component({
    selector: 'interest-crediting-reallocation-download',
    templateUrl: './download.component.html'
})

export class InterestCreditingReallocationDownloadComponent implements OnInit {
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;
    @Input('downloadfilecode') downloadFileCode: string = "";
    @Input('documents') serviceTypeDocuments: ServiceRequestTypeDocumentModel[] = [];
    @Input('policydetail') policyDetail: PolicyModel = null;

    @Output('onservicerequestsaved')
    onServiceRequestSaved = new EventEmitter();

    public serviceRequestTypes: any[] = [];
    public errorMessage: string;

    public policyNumber: string = "";

    public bodyModel: ServiceRequestBodyModel = null;
    public dataItems: KeyValueModel[] = [];
    public emailFaxDataItems: KeyValueModel[] = [];
    public uploadDocText: string = "Upload Interest Crediting Option Reallocation Letter and Submit Service Request";


    constructor(
        private utility: UtilityService,
        private serviceRequestService: ServiceRequestService,
        private route: ActivatedRoute,
        private spinner: SpinnerService) {
        if (this.bodyModel == null)
            this.bodyModel = new ServiceRequestBodyModel();

        var param = this.route.snapshot.params;
        if (param) {
            this.policyNumber = this.route.snapshot.params.PolicyNumber || '';
            this.serviceType = this.route.snapshot.params.ServiceRequestType || '';
        }
    }

    ngOnInit() {
        this.getInterestCreditingOptions();
        this.setEmailFaxBodyValues();
    }

    getInterestCreditingOptions() {
        let interestCreditingOptions: any = [];
        this.spinner.start();
        this.serviceRequestService.getServiceRequestInterestCredit(this.policyNumber)
            .subscribe(res => {
                if (res.isSuccess) {
                    interestCreditingOptions = res.data.interestCredit;
                    this.setInterestCreditingOptionsForWriteALetter(interestCreditingOptions);
                }
                else {
                    this.setUpError(res.message);
                }
            },
                error => {
                    this.setUpError(error);
                });
    }


    setInterestCreditingOptionsForWriteALetter(interestCreditingOptions) {
        let interestCreditingTableHtml = "Write a letter indicating your new interest crediting options. The following are the available interest crediting " +
            "options for your policy:<br/><div class='margin-top10 margin-btm10box box-default table-box table-flip-scroll-xxx-mjd mdl-shadow--2dp'>" +
            "<table class='full-width mdl-data-table-rsp interest-crediting-options'>" +
            "<thead class='cf'><tr>"+
            //"<th>Associated index</th>"+  ==> Do not remove this commented code.
            "<th>Interest crediting method</th>" +
            //"<th>%</th>" +
            "</tr></thead><tbody>";

        let interestCreditingTableRowHtml = "";
        if (interestCreditingOptions != null) {
            interestCreditingOptions.forEach(element => {
                if(element.isOpen){
                    interestCreditingTableRowHtml = interestCreditingTableRowHtml + "<tr>"+
                    //"<td>" + element.associateIndex + "</td>"+  ==> Do not remove this commented code.
                    "<td>" + element.option + "</td>" +
                    //"<td>" + element.rate + "</td>" +
                    "</tr>";
                }
            });
        }
        else {
            interestCreditingTableRowHtml = interestCreditingTableRowHtml + "<tr><td>None</td><td></td></tr>";
        }
        let interestCreditingHtml = interestCreditingTableHtml + interestCreditingTableRowHtml + "</tbody></table></div>";
        this.setBodyValues(interestCreditingHtml);
    }


    setBodyValues(interestCreditingHtml) {
        this.dataItems.push(new KeyValueModel("1. " + this.utility.getConfigText("SR_download_indexCredeitReallocation_writeLetter_title") + "",
            interestCreditingHtml));
        this.dataItems.push(new KeyValueModel("2. " + this.utility.getConfigText("SR_download_indexCredeitReallocation_percentageAllocation_title") + "",
            this.utility.getConfigText("SR_download_indexCredeitReallocation_percentageAllocation_value")));
        this.dataItems.push(new KeyValueModel("3. " + this.utility.getConfigText("SR_offline_common_signature_title") + "",
            this.utility.getConfigText("SR_offline_common_signature_value")));
        this.dataItems.push(new KeyValueModel("4. " + this.utility.getConfigText("SR_download_indexCredeitReallocation_timeToProcess_title") + "",
            this.utility.getConfigText("SR_download_indexCredeitReallocation_timeToProcess_value")));
        this.dataItems.push(new KeyValueModel("5. " + this.utility.getConfigText("SR_offline_common_submitForm_title") + "",
            this.utility.getConfigText("SR_offline_common_submitReallocationLetter_value")));
    }

    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
    }

    setEmailFaxBodyValues() {
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 1).toString() + ". " + this.utility.getConfigText("SR_offline_common_confirmation_title") + "", this.utility.getConfigText("SR_offline_common_confirmation_value")));
    }

    onBodyValueChanged(event) {
        this.bodyModel = event;
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }
}