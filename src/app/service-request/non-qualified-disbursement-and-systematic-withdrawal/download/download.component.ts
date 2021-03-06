import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnType } from 'app/enums/column-type.enum';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { KeyValueModel } from 'app/models/keyValue.model';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'non-qualified-disbursement-systematic-withdrawl-download',
    styles: [],
    templateUrl: './download.component.html'
})

export class ServiceRequestNonQualifiedDisbursementAndSystematicWithdrawlDownloadComponent implements OnInit {
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

    constructor(private utility: UtilityService) {
        if (this.bodyModel == null)
            this.bodyModel = new ServiceRequestBodyModel();
    }

    ngOnInit() {
        this.serviceTypeDocuments=[];
        this.SetBodyValues();
        this.SetEmailFaxBodyValues();
    }

    SetBodyValues() {
        this.dataItems.push(new KeyValueModel("1. " + this.utility.getConfigText("SR_offline_common_downloadForm_title") + "", "", ColumnType.Download));
        this.dataItems.push(new KeyValueModel("2. " + this.utility.getConfigText("SR_offline_common_complForm_title") + "", this.utility.getConfigText("SR_download_disbursement_nonQualified_complRequestDistribution_value")));
        this.dataItems.push(new KeyValueModel("3. " + this.utility.getConfigText("SR_download_disbursement_surrender_title") + "", this.utility.getConfigText("SR_download_disbursement_nonQualified_annuity_surrender_value")));
        this.dataItems.push(new KeyValueModel("4. " + this.utility.getConfigText("SR_offline_common_signature_title") + "", this.utility.getConfigText("SR_download_disbursement_nonQualified_annuity_surrender_signature_value")));
        this.dataItems.push(new KeyValueModel("5. " + this.utility.getConfigText("SR_offline_common_submitForm_title") + "", this.utility.getConfigText("SR_offline_common_submitForm_value")));
    }

    SetEmailFaxBodyValues() {
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 1).toString() + ". " + this.utility.getConfigText("SR_download_disbursement_nonQualified_annuity_daysToProcess_title") + "", this.utility.getConfigText("SR_download_disbursement_nonQualified_annuity_daysToProcess_value")));
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 2).toString() + ". " + this.utility.getConfigText("SR_download_disbursement_nonQualified_annuity_payment_title") + "", this.utility.getConfigText("SR_download_disbursement_nonQualified_annuity_payment_value")));
    }

    onBodyValueChanged(event) {
        this.bodyModel = event;
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }
}