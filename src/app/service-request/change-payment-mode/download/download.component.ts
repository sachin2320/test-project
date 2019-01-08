import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnType } from 'app/enums/column-type.enum';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { KeyValueModel } from 'app/models/keyValue.model';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'change-payment-mode-download',
    styles: [],
    templateUrl: './download.component.html'
})

export class ServiceRequestChangePaymentModeDownloadComponent implements OnInit {
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

    public premiumType: string = "1";
    public changePaymentModeForm: FormGroup = null;
    public isUploadTabVisible: boolean = false;
    public isEmailFaxTabVisible: boolean = false;
    public premiumMode: string = "Annual";

    constructor(private utility: UtilityService, private formBuilder: FormBuilder) {
        if (this.bodyModel == null)
            this.bodyModel = new ServiceRequestBodyModel();
    }

    ngOnInit() {
        this.setupFormFields();
        this.serviceTypeDocuments=[];
        this.SetBodyValues();
        this.SetEmailFaxBodyValues();
    }

    setupFormFields() {
        this.changePaymentModeForm = this.formBuilder.group({
            premiumType: [this.premiumType],
        });
    }

    onPremiumTypeChanged(event: any) {
        this.premiumType = event.value;
        this.premiumMode = event.value == "1" ? "Annual" : "Monthly";
        this.dataItems = [];
        this.emailFaxDataItems = [];
        this.isUploadTabVisible = false;
        this.isEmailFaxTabVisible = false;
        this.SetBodyValues();
        this.SetEmailFaxBodyValues();
    }

    SetBodyValues() {
        if(this.premiumType == "2"){ //Change Premium Mode (Monthly) 
            this.dataItems.push(new KeyValueModel("1. " + this.utility.getConfigText("SR_download_changePaymentMode_downloadForm_title") + "", "", ColumnType.Download));
            this.dataItems.push(new KeyValueModel("2. " + this.utility.getConfigText("SR_download_changePaymentMode_complForm_title") + "", this.utility.getConfigText("SR_download_changePaymentMode_complForm_value")));
            this.dataItems.push(new KeyValueModel("3. " + this.utility.getConfigText("SR_download_automaticPremiumBankInformation_complForm_title") + "", this.utility.getConfigText("SR_download_changePaymentMode_complFinancialInstitution_value")));
            this.dataItems.push(new KeyValueModel("4. " + this.utility.getConfigText("SR_offline_common_submitForm_title") + "", this.utility.getConfigText("SR_offline_common_submitForm_value")));
        }
        else
        { //Change Premium Mode (Annual, Semiannual, Quarterly)
            this.dataItems.push(new KeyValueModel("1. " + this.utility.getConfigText("SR_offline_common_downloadForm_title") + "", "", ColumnType.Download));
            this.dataItems.push(new KeyValueModel("2. " + this.utility.getConfigText("SR_offline_common_complForm_title") + "", this.utility.getConfigText("SR_download_changePaymentMode_Annually_complForm_value")));
            this.dataItems.push(new KeyValueModel("3. " + this.utility.getConfigText("SR_offline_common_submitForm_title") + "", this.utility.getConfigText("SR_offline_common_submitForm_value")));
        }
        this.setModelData();
    }

    SetEmailFaxBodyValues() {
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 1).toString() + ". " + this.utility.getConfigText("SR_offline_common_3to5daysToProcess_title") + "", this.utility.getConfigText("SR_offline_common_3to5daysToProcess_value")));
        this.emailFaxDataItems.push(new KeyValueModel((this.dataItems.length + 2).toString() + ". " + this.utility.getConfigText("SR_offline_common_confirmation_title") + "", this.utility.getConfigText("SR_download_common_confirmationToOwnerOnCompletion_value")));
    }

    onBodyValueChanged(event) {
        this.bodyModel = event;
        this.setModelData();
    }

    setModelData()
    {
        this.bodyModel.modelData = { 
            premiumMode : this.premiumType == "1" ? 
            this.utility.getConfigText("SR_download_changePaymentMode_premium_mode_annually_value")
            : this.utility.getConfigText("SR_download_changePaymentMode_premium_mode_monthly_value")
        };
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }

    onEmailFaxOrUploadLinkClickedFired(event) {
        this.isUploadTabVisible = event.isUploadTabVisible;
        this.isEmailFaxTabVisible = event.isEmailFaxTabVisible;
    }
}