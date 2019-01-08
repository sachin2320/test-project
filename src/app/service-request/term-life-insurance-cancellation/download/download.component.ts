import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { KeyValueModel } from 'app/models/keyValue.model';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { ServiceRequestBodyModel } from 'app/models/serviceRequetsOfflineBody.model';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'term-life-insurance-cancellation-download',
    styles: [],
    templateUrl: 'download.component.html'
})

export class ServiceRequestTermLifeInsuranceCancelDownloadComponent implements OnInit {
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

    public showLifeAnnuityFax:boolean = false;
    public showLifeFax:boolean = true;
    public uploadDocText: string = "Upload Cancellation letter and Submit Service Request";  
    
    constructor(private utility: UtilityService) {
        if (this.bodyModel == null)
            this.bodyModel = new ServiceRequestBodyModel();
    }

    ngOnInit() {       
        this.SetBodyValues();
        
    }

    SetBodyValues() {       
        this.dataItems.push(new KeyValueModel("", this.utility.getConfigText("SR_offline_cancelTermLifeInsurance_value")));
    }    

    onBodyValueChanged(event) {
        this.bodyModel = event;
    }

    onServiceRequestSavedFired(event) {
        this.onServiceRequestSaved.emit(event);
    }
}