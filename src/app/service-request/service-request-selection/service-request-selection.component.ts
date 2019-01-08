import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { ServiceRequestType } from "app/enums/service-type.enum";
import { UtilityService } from "app/services/helper/utility.service";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";

@Component({
    selector: 'service-request-selection',
    styles: [],
    templateUrl: './service-request-selection.component.html'
})

export class ServiceRequestSelectionComponent implements OnInit {
    public serviceRequestTypes: any[] = [];
    public serviceRequestPolicies: any[] = [];

    public errorMessage: string;    
    public selectedPolicy: any;
    public selectedPolicyNumber : string;
    public serviceType: ServiceRequestType = ServiceRequestType.None;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private serviceRequest: ServiceRequestService,
        private spinner: SpinnerService,
        public config: AppConfig,
        private notification: SnackbarService,      
        private utility: UtilityService) { }

    ngOnInit() {
        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined
            && queryParam.PolicyNumber != undefined && queryParam.ServiceRequestType != undefined) {
            this.GetPolicyToNavigateServiceRequest(queryParam.PolicyNumber, queryParam.ServiceRequestType);
        }
        else {
            this.GetPolicies();
        }
    }

    GetPolicyToNavigateServiceRequest(policyNumber: string, serviceRequestTypeId: string) {
        this.spinner.start();
        this.serviceRequest.getServiceRequestPolicyList(PolicyUsageIndicator.ServiceRequest).subscribe(res => {
            if (res.isSuccess) {
                this.spinner.stop();            
                if (res.data.policyList.length == 1) {                  
                    this.GetServiceRequestTypesToNavigateServiceRequest(policyNumber, serviceRequestTypeId);
                }
                else {                  
                    this.serviceRequestPolicies = res.data.policyList;
                    this.GetServiceRequestTypesToNavigateServiceRequest(policyNumber, serviceRequestTypeId);
                }
            }
            else {
                this.setUpError(res.message);
            }
        }, error => {
            this.setUpError(error);
        });
    }

    GetPolicies() {
        this.spinner.start();
        this.serviceRequest.getServiceRequestPolicyList(PolicyUsageIndicator.ServiceRequest).subscribe(res => {
            if (res.isSuccess) {
                if (res.data.policyList.length == 1) {     
                    this.selectedPolicy = res.data.policyList[0];    
                    this.selectedPolicyNumber = this.selectedPolicy.policyNumber;    
                    this.GetServiceRequestTypes(this.selectedPolicyNumber);
                }
                this.spinner.stop();
                this.serviceRequestPolicies = res.data.policyList;
            }
            else {
                this.setUpError(res.message);
            }
        }, error => {
            this.setUpError(error);
        });
    }

    GetServiceRequestTypes(policyNumber: string, isDisplaySpinner: boolean = true) {
        if (isDisplaySpinner)
            this.spinner.start();

        this.serviceRequest.getServiceRequestTypes(policyNumber).subscribe(res => {
            if (res.isSuccess) {
                this.spinner.stop();
                this.serviceRequestTypes = res.data.serviceRequestTypes;
            }
            else {
                this.setUpError(res.message);
            }
        },
            error => {
                this.setUpError(error);
            });
    }

    GetServiceRequestTypesToNavigateServiceRequest(policyNumber: string, serviceRequestTypeId: string, 
        isDisplaySpinner: boolean = true) {
        this.serviceRequest.getServiceRequestTypes(policyNumber).subscribe(res => {
            if (isDisplaySpinner)
                this.spinner.start();

            if (res.isSuccess) {
                this.spinner.stop();
                this.serviceRequestTypes = res.data.serviceRequestTypes;

                this.serviceRequestTypes.forEach(x => {
                    if (x.requestTypeId == serviceRequestTypeId) {
                        this.serviceTypeChangeToNavigateServiceRequest(policyNumber, x.requestTypeId, x.isOnlineAllow)
                    }
                });
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

    policyChanged(event) {     
        this.selectedPolicy = event;
        this.selectedPolicyNumber = event.policyNumber;
        this.GetServiceRequestTypes(event.policyNumber);
    }

    serviceTypeChange(event) {
        this.utility.saveReturnUrlForCancelServiceRequestNavigation();
        this.navigateToService(this.selectedPolicy.policyNumber, event.requestTypeId, event.isOnlineAllow);
    }

    serviceTypeChangeToNavigateServiceRequest(policyNumber: string, requestTypeId: any, isOnlineAllow: any) {
        this.navigateToService(policyNumber, requestTypeId, isOnlineAllow);
    }

    navigateToService(policyNumber: string, requestTypeId: any, isOnlineAllow: any){
        this.serviceType = requestTypeId;
        let url: string = this.config.getConfig(isOnlineAllow ? 'appServiceRequestOnlineUrl' : 'appServiceRequestOfflineUrl') + '/' + policyNumber + "/" + this.serviceType;
        this.router.navigate([url]);
    }
}