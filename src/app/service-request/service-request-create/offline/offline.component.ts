import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from 'app/configuration/app.config';
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { PolicyModel } from 'app/models/policy.model';
import { ServiceRequestHeaderModel } from 'app/models/serviceRequestHeader.model';
import { ServiceRequestTypeDocumentModel } from 'app/models/serviceRequestTypeDocument.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { ServiceRequestService } from 'app/services/service-request/service-request.service';
import { DataService } from 'app/shared-services/data.service';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { SpinnerService } from 'app/shared-services/spinner.service';


@Component({
    selector: 'service-request-offline',
    styles: [],
    templateUrl: './offline.component.html'
})

export class ServiceRequestOfflineComponent implements OnInit {

    public errorMessage: string;

    public policyNumber: string = '';
    public zendeskTicketId: string = '';   
    public confirmationMessage: string = '';
    public userNotAuthorizedMessage:string='';
    public aditionalConfirmationDisclosure: string = '';
    public isSubmissionSuccess: boolean = false;

    public policyDetail: PolicyModel = null;
    public downloadFileCode: string = '';
    public serviceType: ServiceRequestType = ServiceRequestType.None;
    public serviceTypeDocuments: ServiceRequestTypeDocumentModel[] = [];

    public headerModel: ServiceRequestHeaderModel = null;

    constructor(private route: ActivatedRoute,
        private serviceRequest: ServiceRequestService,
        private spinner: SpinnerService,
        private notification: SnackbarService,
        private utility: UtilityService,
        public config: AppConfig,
        private dataService: DataService) {

        var param = this.route.snapshot.params;
        if (param != null && param != undefined) {
            this.policyNumber = this.route.snapshot.params.PolicyNumber || '';
            this.serviceType = this.route.snapshot.params.ServiceRequestType || '';
        }

        this.headerModel = new ServiceRequestHeaderModel();
        this.policyDetail = new PolicyModel();
    }

    ngOnInit() {
        this.getPolicy(this.policyNumber);
    }

    setupHeader() {
        this.headerModel = new ServiceRequestHeaderModel();
        this.headerModel.serviceName = this.utility.getOfflineServiceRequestDisplayName(this.serviceType);
    }

    getPolicy(policyNumber: string): any {
        this.spinner.start();
        this.serviceRequest.getServiceRequestPolicyList(PolicyUsageIndicator.ServiceRequest, this.policyNumber).subscribe(res => {
            if (res.isSuccess) {               
                this.spinner.stop();
                let result = res.data.policyList;
                if (this.utility.validatePolicyList(res.data.policyList)) {
                    let filterResult = result.filter(f => f.policyNumber == policyNumber);
                    if (filterResult.length > 0)
                        this.policyDetail = filterResult[0];
                    this.setupHeader();
                    this.getServiceTypeDetail(this.serviceType.valueOf());
                }
                else
                {
                    this.userNotAuthorizedMessage = this.config.getConfig('userIsNotAuthorized');
                }  
            }
            else {
                this.setUpError(res.message);
            }
        }, error => {
            this.setUpError(error);
        });
    }

    getServiceTypeDetail(serviceTypeId: number = null): any {
        this.spinner.start();
        this.serviceRequest.getServiceRequestTypes(this.policyNumber, serviceTypeId).subscribe(res => {
            if (res.isSuccess) {
                this.spinner.stop();
                let result = res.data.serviceRequestTypes;
                let isDownloadRequest = false;
                if (result[0] != undefined) {
                    // ALM-282 You are not authorized to perform this action. message showing for every life policy
                    if (this.dataService && this.dataService.serviceRequestNavigationData && 
                        this.dataService.serviceRequestNavigationData.isDownloadRequest) {
                        isDownloadRequest = true;
                    } else {
                        isDownloadRequest = result[0].isOnlineAllow ? false : true;
                    }
                }

                if (this.utility.validateServiceRequest(res.data.serviceRequestTypes, isDownloadRequest)) {
                     if (result.length > 0 && result[0].documents != null && result[0].documents.length > 0)
                         this.serviceTypeDocuments = result[0].documents;
                 }
                 else
                 {
                     this.userNotAuthorizedMessage = this.config.getConfig('userIsNotAuthorized');
                 }               
            }
            else {
                this.setUpError(res.message);
            }
        }, error => {
            this.setUpError(error);
        });
    }

    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }

    onServiceRequestSaved(event) {
        this.isSubmissionSuccess = event.isSuccess;
        if (event.isSuccess) {
            this.zendeskTicketId = event.data.ticketId;          
            this.confirmationMessage = event.data.result.confirmationMessage;
            this.aditionalConfirmationDisclosure = event.data.result.aditionalConfirmationDisclosure;
        }
        else
            this.setUpError(event.message);
    }
}