import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnType } from 'app/enums/column-type.enum';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { KeyValueModel } from 'app/models/keyValue.model';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'change-beneficiary-offline',
    styles: [],
    templateUrl: './offline.component.html'
})

export class ServiceRequestBeneficiaryChangeOfflineComponent implements OnInit {
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;
    @Input('downloadfilecode') downloadFileCode: string = "";
    @Input('documents') serviceTypeDocuments: ServiceRequestTypeDocumentModel[] = [];
    @Input('policydetail') policyDetail: PolicyModel = null;

    @Output('onservicerequestsaved')
    onServiceRequestSaved = new EventEmitter();
   
    public serviceRequestTypes: any[] = [];
    public policyNumber: string = "";
    public bodyModel: ServiceRequestBodyModel = null;
    
    public dataItems: KeyValueModel[] = [];
    public emailFaxDataItems: KeyValueModel[] = [];

    constructor(private utility: UtilityService) {
        if (this.bodyModel == null)
            this.bodyModel = new ServiceRequestBodyModel();
    }

    ngOnInit() {
        this.SetBodyValues();
        this.SetEmailFaxBodyValues();
    }

    SetBodyValues() {
        this.dataItems.push(new KeyValueModel("1. "+this.utility.getConfigText("SR_offline_common_downloadForm_title")+"", "", ColumnType.Download));
        this.dataItems.push(new KeyValueModel("2. "+this.utility.getConfigText("SR_offline_chng_beneficiary_complForm_title")+"", this.utility.getConfigText("SR_offline_chng_beneficiary_complForm_value")));
        this.dataItems.push(new KeyValueModel("3. "+this.utility.getConfigText("SR_offline_common_signature_title")+"", this.utility.getConfigText("SR_offline_common_signature_value")));
        this.dataItems.push(new KeyValueModel("4. "+this.utility.getConfigText("SR_download_common_powOfAttor_title")+"", this.utility.getConfigText("SR_offline_chng_beneficiary_powOfAttor_value")));
        this.dataItems.push(new KeyValueModel("5. "+this.utility.getConfigText("SR_offline_common_submitForm_title")+"", this.utility.getConfigText("SR_offline_common_submitForm_value")));
    }

    SetEmailFaxBodyValues() {
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 1).toString() + ". " + this.utility.getConfigText("SR_offline_common_3to5daysToProcess_title") + "", this.utility.getConfigText("SR_offline_common_3to5daysToProcessRequiredInfo_value")));
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 2).toString() + ". " + this.utility.getConfigText("SR_offline_common_confirmation_title") + "", this.utility.getConfigText("SR_offline_common_confirmation_value")));
    }
    
    onBodyValueChanged(event) {
        this.bodyModel = event;
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }
}