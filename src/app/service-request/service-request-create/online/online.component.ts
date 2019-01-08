import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { ServiceRequestType } from "app/enums/service-type.enum";
import { UserPermissionKey } from 'app/enums/user-permission-key.enum';
import { FileUpload } from 'app/models/fileUpload.model';
import { NavigationStateChangeModel } from 'app/models/navigationStateChange.model';
import { ServiceRequestDocumentModel } from 'app/models/serviceRequestDoument.model';
import { ServiceRequestFooterModel } from "app/models/serviceRequesterFooter.model";
import { ServiceRequestHeaderModel } from "app/models/serviceRequestHeader.model";
import { ServiceRequestBodyComponent } from 'app/service-request/service-request-body/online/service-request-body.component';
import { ServiceRequestPrintComponent } from "app/service-request/service-request-print/online/online.component";
import { UtilityService } from "app/services/helper/utility.service";
import { PolicyService } from 'app/services/policy/policy.service';
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { DataService } from 'app/shared-services/data.service';
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";

@Component({
    selector: 'servicerequest-online',
    templateUrl: './online.component.html'
})

export class ServiceRequestOnlineComponent implements OnInit {

    public isDataLoadCompleted: boolean = false;
    public ticketId: string = '';
    public aditionalConfirmationDisclosure: string = '';
    public confirmationMessage: string = '';

    public isBodyDataValid: boolean = false;
    public isHeaderDataValid: boolean = false;
    public isAgreedToTerms: boolean = false;
    public isFooterValid: boolean = false;

    public isViewOnly: boolean = false;
    public isPrintOnly: boolean = false;
    public isSrDetailOnly: boolean = false;
    public hideNavigationButton: boolean = false;
    public navigationState: NavigationStateChangeModel = null;

    public isRequestSubmitted: boolean = false;

    public errorMessage: string = '';
    public userNotAuthorizedMessage: string = '';
    public printHtml: string = '';
    public ownerName: string = '';
    public policyNumber: string = '';
    public policyDetail: any = null;
    public serviceType: ServiceRequestType = ServiceRequestType.None;

    public headerModel: ServiceRequestHeaderModel = null;
    public footerModel: ServiceRequestFooterModel = null;
    public serviceDocuments: ServiceRequestDocumentModel[] = [];
    public bodyModel: any = {};
    public uploadedFiles: FileUpload[] = [];

    public isHeaderHidden: boolean = false;
    public isFooterHidden: boolean = false;   

    @ViewChild('pdfExport', { read: ViewContainerRef }) pdfExportContainer: ViewContainerRef;
    public componentRef: ComponentRef<ServiceRequestPrintComponent>;

    @ViewChild('serviceRequestBodyComponent') serviceRequestBodyComponent: ServiceRequestBodyComponent;


    constructor(private route: ActivatedRoute,
        private router: Router,
        private utility: UtilityService,
        private serviceRequest: ServiceRequestService,
        private policyService: PolicyService,
        private spinner: SpinnerService,
        private dataService: DataService,
        public config: AppConfig,
        private notification: SnackbarService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private changeDetector: ChangeDetectorRef,
        ) {

        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined) {
            this.policyNumber = this.route.snapshot.params.PolicyNumber || '';
            this.serviceType = this.route.snapshot.params.ServiceRequestType || '';
        }

        this.headerModel = new ServiceRequestHeaderModel();
        this.footerModel = new ServiceRequestFooterModel();
        this.footerModel.authorizationChkBoxItems = this.utility.getServiceAgreementList(this.serviceType);
    }

    ngAfterViewChecked() {
        this.changeDetector.detectChanges();
    }

    ngOnInit() {
        this.getPolicy(this.policyNumber);
    }

    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }

    setupHeader() {
        let policy = this.policyDetail;
        this.ownerName = this.policyDetail.ownerName;
        this.headerModel = new ServiceRequestHeaderModel(policy.ownerName,
            this.policyNumber, policy.ownerEmail, policy.ownerPhone,
            this.utility.getServiceRequestDisplayName(this.serviceType),
            this.utility.getServiceRequestHeaderText(this.serviceType, true),
            this.utility.getServiceRequestHeaderText(this.serviceType, false), '', '',
            this.utility.isSsnNeedToDisplay(this.serviceType), '',
            this.utility.isOwnerAddressNeedToDisplay(this.serviceType), policy.ownerAddress);

        if (!this.headerModel.showSsn)
            this.isHeaderDataValid = true;
    }

    getPolicy(policyNumber: string): any {
        this.spinner.start();
        this.isDataLoadCompleted = false;
        this.serviceRequest.getServiceRequestPolicyList(PolicyUsageIndicator.ServiceRequest, this.policyNumber).subscribe(res => {
            if (res.isSuccess) {
                this.spinner.stop();
                let result = res.data.policyList;
                this.isDataLoadCompleted = true;

                if (this.utility.validatePolicyList(res.data.policyList)) {
                    let filterResult = result.filter(f => f.policyNumber == policyNumber);
                    if (filterResult.length > 0)
                        this.policyDetail = filterResult[0];

                    this.setupHeader();
                    this.getServiceTypeDetail();
                }
                else {
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

    getServiceTypeDetail() {
        this.spinner.start();
        this.serviceRequest.getServiceRequestTypes(this.policyNumber, this.serviceType).subscribe(res => {
            if (res.isSuccess) {
                this.spinner.stop();
                let result = res.data.serviceRequestTypes;
                let isOnlineRequest = false;
                if (result[0] != undefined) {
                    isOnlineRequest = result[0].isOnlineAllow ? true : false;
                }
                if (!this.utility.validateServiceRequest(res.data.serviceRequestTypes, isOnlineRequest)) {
                    this.userNotAuthorizedMessage = this.config.getConfig('userIsNotAuthorized');
                }
            }
            else {
                this.setUpError(res.message);
            }
        },
            error => {
                this.setUpError(error);
            });
    }

    next() {
        this.errorMessage = '';
        let isSsnVerificationRequired = this.headerModel.showSsn && this.headerModel.ssn != "";
        if (isSsnVerificationRequired) {
            let policyNumber: string = this.headerModel.policyNumber;
            let ownerSsn = this.headerModel.ssn.replace(/-/g, '');
            this.spinner.start();
            this.verifyOwnerSsn(policyNumber, null, ownerSsn, true).subscribe((res) => {
                if (res) {
                    this.navigateServiceRequestBodyComponent(true);
                    //If simulated user has no permission to submit service request, display error message to user 
                    if (!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key))
                        this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
                }
            });
        }
        else {
            this.navigateServiceRequestBodyComponent(true);

            //If simulated user has no permission to submit service request, display error message to user 
            if (!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key))
                this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
        }
    }

    navigateServiceRequestBodyComponent(isViewOnly: boolean) {
        this.isViewOnly = isViewOnly;
        this.serviceRequestBodyComponent.onPageNavigation(this.isViewOnly);
    }

    verifyOwnerSsn(policyNumber, ownerDob, ownerSsn, isValidateFullSsn) {
        return this.policyService.verifyOwnerSsn(policyNumber, ownerDob, ownerSsn, isValidateFullSsn).map(res => {
            this.spinner.stop();
            if (res.code) {
                this.setUpError(res.message);
                return false;
            }
            else
                return true;
        },
            error => {
                this.setUpError(error);
                return false;
            });
    }

    cancelRequest() {
        this.utility.navigateOnCancelServiceRequest();
    }

    previous() {
        this.errorMessage = '';
        if (this.navigationState != null && !this.isViewOnly) {
            this.navigationState.hideParentNavigation = !this.navigationState.hideParentNavigation;
            this.hideNavigationButton = this.navigationState.hideParentNavigation;
            this.dataService.serviceRequestNavigationStateChanged.next(this.navigationState);
            return;
        }

        this.navigateServiceRequestBodyComponent(false);
    }

    submitRequest() {
        //If simulated user has no permission to submit service request, display error message to user 
        //otherwise allow user to submit service request.
        if (!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key)) {
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
            return false;
        }

        //Submit service request
        this.errorMessage = '';
        this.spinner.start();

        this.isPrintOnly = true; //For Print compatible HTML Capture.

        //GUI take few second to refresh the screen, putting some intervals.
        setTimeout(() => {
            let bodyHtml: string = document.getElementById("bodyToBeExtract").outerHTML;
            let saveModel = this.serviceRequest.prepareServiceRequestSaveModel(this.serviceType, this.policyNumber, true, this.bodyModel, this.footerModel, this.headerModel, bodyHtml);
            if (saveModel != null)
                saveModel.serviceDocuments = this.serviceDocuments;

            this.isPrintOnly = false;

            const formData = new FormData();
            this.uploadedFiles.forEach(x => {
                if (x.fileValue) {
                    console.log("submitRequest appending file upload information to form data...");
                    formData.append(x.id.toString(), x.fileValue, x.fileName);
                }
            });

            formData.append("model", JSON.stringify(saveModel));

            this.spinner.start();
            this.serviceRequest.submitServiceRequest(formData).subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {

                    this.ticketId = res.data.ticketId;
                    this.aditionalConfirmationDisclosure = res.data.result.aditionalConfirmationDisclosure;
                    this.confirmationMessage = res.data.result.confirmationMessage;
                    this.isRequestSubmitted = true;
                }
                else {
                    if (res.code == "20008") { //if Owner DOB is valid
                        $("#dvOwnerDob").find(".mat-form-field-underline").removeClass("border1px-red");
                        $("#dvOwnerDob").find(".mat-form-field-ripple").removeClass("border1px-red");
                    }
                    else { //if Owner DOB is invalid
                        $("#dvOwnerDob").find(".mat-form-field-underline").addClass("border1px-red");
                        $("#dvOwnerDob").find(".mat-form-field-ripple").addClass("border1px-red");
                    }

                    if (res.code == "20007") {//if Owner SSN is valid
                        $("#dvOwnerSsn").find(".mat-form-field-underline").removeClass("border1px-red");
                        $("#dvOwnerSsn").find(".mat-form-field-ripple").removeClass("border1px-red");
                    }
                    else { //if Owner SSN is invalid
                        $("#dvOwnerSsn").find(".mat-form-field-underline").addClass("border1px-red");
                        $("#dvOwnerSsn").find(".mat-form-field-ripple").addClass("border1px-red");
                    }

                    this.setUpError(res.message);
                }
            }, error => { this.setUpError(error); });
        }, 3000);
    }

    onRequestBodyValueChanged(event) {
        this.isBodyDataValid = event.IsDataValid;

        if (event.UploadedFile != undefined)
            this.uploadedFiles = event.UploadedFile;

        if (event.ServiceDocuments != undefined) {
            this.serviceDocuments = event.ServiceDocuments;
        }

        if (this.serviceType == ServiceRequestType.ChangePaymentMode
            && event.UpdatePaymentModeData != undefined
            && event.UpdatePaymentModeData.premiumType != undefined) {
            let premiumType: number = event.UpdatePaymentModeData.premiumType;
            let oldAuthItems = this.footerModel.authorizationChkBoxItems;
            this.footerModel.authorizationChkBoxItems = this.utility.getServiceAgreementList(this.serviceType, premiumType);
            this.footerModel.authorizationChkBoxItems.forEach(x => {
                let disclosure = oldAuthItems.filter(y => y.disclosureText == x.disclosureText && y.isDisclosureAccepted == true);
                if (disclosure.length > 0)
                    x.isDisclosureAccepted = true;
            });
        }

        this.bodyModel = event;
    }

    onRequestFooterValueChanged(event) {
        this.isAgreedToTerms = event.IsAgreementAccepted;
        this.isFooterValid = event.IsDataVaid;
        this.footerModel = event.FooterData;
    }

    onRequestHeaderValueChanged(event) {
        this.isHeaderDataValid = event.IsHeaderDataValid;
        this.headerModel.ssn = event.Ssn;
    }

    onNavigationStateChange(event: NavigationStateChangeModel) {
        this.navigationState = event;
        this.hideNavigationButton = event.hideParentNavigation;
    }

    onErrorRaised(event) {
        this.setUpError(event);
    }    

    //this function will be called when user click on print button after submitting service request.
    onServiceRequestPrintClick(zendeskTicketId: number, kendPdfExport: any) {
        this.pdfExportContainer.clear();

        let inputProviders = [{ provide: "zendeskRequestId", useValue: zendeskTicketId },
        { provide: "styles", useValue: this.config.getConfig("printPdfStyleSheetUrl") }];

        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.pdfExportContainer.injector);
        const factory = this.componentFactoryResolver.resolveComponentFactory(ServiceRequestPrintComponent);
        this.componentRef = this.pdfExportContainer.createComponent(factory, 0, injector);        

        let proxyApiPath = this.config.getConfig("apiBaseUrl") + this.config.getConfig("savePdfDocument");
        let forceProxy = false;
        let proxyTarget = "serviceRequestPDFWindow";

        if (navigator.platform.match(/Android/i)) {
            proxyApiPath = "";
            proxyTarget = "";
        }
        else {
            //Fix for ALM #402. Now in IE & edge we are opening pdf in new tab.      
            //In IE11 & edge when user was clicking on print button multiple times, browser was sending GET & 
            //POST request alternatively, but post request was required to refresh already opened pdf.
            //So, in order to make POST request in IE11 & edge pdf needs to be open in new window.

            if (navigator.userAgent.match(/Trident/i) || navigator.userAgent.match(/Edge/i)) {
                proxyTarget = proxyTarget + "_" + this.utility.getGuid();
            }

            window.open('', proxyTarget);
            forceProxy = true;
        }

        this.componentRef.instance.loadSubscriber.subscribe(x => {
            setTimeout(() => {
                kendPdfExport.allPages = true,
                    kendPdfExport.page = true,
                    kendPdfExport.portrait = true,
                    kendPdfExport.margin = { top: "5mm", left: "5mm", right: "5mm", bottom: "5mm" },
                    kendPdfExport.paperSize = "A4",
                    kendPdfExport.scale = 0.8,
                    kendPdfExport.proxyURL = proxyApiPath,
                    kendPdfExport.forceProxy = forceProxy,
                    kendPdfExport.proxyTarget = proxyTarget;
                kendPdfExport.saveAs('Service-Request.pdf');               
            });
        });
    }
}
