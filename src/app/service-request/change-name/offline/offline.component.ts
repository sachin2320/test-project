import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { KeyValueModel } from 'app/models/keyValue.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { ColumnType } from 'app/enums/column-type.enum';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';

@Component({
    selector: 'change-name-offline',
    styles: [],
    templateUrl: './offline.component.html'
})

export class ServiceRequestNameChangeOfflineComponent implements OnInit {
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
        this.SetBodyValues();
        this.SetEmailFaxBodyValues();
    }

    SetBodyValues() {
        this.dataItems.push(new KeyValueModel("1. " + this.utility.getConfigText("SR_offline_common_downloadForm_title") + "", "", ColumnType.Download));
        this.dataItems.push(new KeyValueModel("2. " + this.utility.getConfigText("SR_offline_common_complForm_title") + "", this.utility.getConfigText("SR_offline_chng_name_complForm_value")));
        this.dataItems.push(new KeyValueModel("3. " + this.utility.getConfigText("SR_offline_common_submitForm_title") + "", this.utility.getConfigText("SR_offline_common_submitForm_value")));
    }

    SetEmailFaxBodyValues() {
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 1).toString() + ". " + this.utility.getConfigText("SR_offline_common_3to5daysToProcess_title") + "", this.utility.getConfigText("SR_offline_common_3to5daysToProcess_value")));
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 2).toString() + ". " + this.utility.getConfigText("SR_offline_common_confirmation_title") + "", this.utility.getConfigText("SR_offline_common_confirmation_value")));
    }

    onBodyValueChanged(event) {
        this.bodyModel = event;
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }
}