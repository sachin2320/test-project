import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnuityPolicyTab } from 'app/enums/policy-tab.enum';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { KeyValueModel } from 'app/models/keyValue.model';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'interest-crediting-reallocation-fia-download',
    styles: [],
    templateUrl: './download.component.html'
})

export class ServiceRequestInterestCreditingReallocationFiaDownloadDownloadComponent implements OnInit {
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
    public uploadDocText: string = "Upload Interest Crediting Option Reallocation Form and Submit Service Request";
    public showBodyHeaderText: boolean = true;
    public bodyHeaderText: string = "";

    constructor(private utility: UtilityService,
        private route: ActivatedRoute, ) {
        var param = this.route.snapshot.params;
        if (param != null && param != undefined && param.PolicyNumber != null) {
            this.policyNumber = param.PolicyNumber;          
        }

        if (this.bodyModel == null)
            this.bodyModel = new ServiceRequestBodyModel();
    }

    ngOnInit() {
        this.serviceTypeDocuments = [];
        this.setUpBodyHeaderText();
        this.SetBodyValues();
        this.SetEmailFaxBodyValues();
    }

    SetBodyValues() {
        this.dataItems.push(new KeyValueModel("1. " + this.utility.getConfigText("SR_offline_common_submitForm_title") + "", this.utility.getConfigText("SR_offline_common_submitForm_value")));
    }

    SetEmailFaxBodyValues() {
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 1).toString() + ". " + this.utility.getConfigText("SR_offline_common_confirmation_title") + "", this.utility.getConfigText("SR_offline_common_confirmation_value")));
    }

    setUpBodyHeaderText() {
        //A is for Anuity Policy.
        let navigationUrl = "/#/app/policy/view/" + this.policyNumber + "/A/" + AnnuityPolicyTab.Documents;   
        let bodyHeaderText = this.utility.getConfigText("SR_download_interest_crediting_reallocation_fia");
        this.bodyHeaderText = bodyHeaderText.replace("navigationUrl", navigationUrl);
    }

    onBodyValueChanged(event) {
        this.bodyModel = event;
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }
}