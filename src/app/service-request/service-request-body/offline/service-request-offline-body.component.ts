import { OnInit, Component, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { ServiceRequestTypeDocumentModel } from "app/models/serviceRequestTypeDocument.model";
import { PolicyModel } from "app/models/policy.model";
import { KeyValueModel } from "app/models/keyValue.model";
import { ServiceRequestBodyModel } from "app/models/serviceRequetsOfflineBody.model";
import { FileUpload } from "app/models/fileUpload.model";
import { ServiceRequestDocumentModel } from "app/models/serviceRequestDoument.model";
import { UtilityService } from "app/services/helper/utility.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { AppConfig } from "app/configuration/app.config";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { Router } from "@angular/router";
import { DataService } from "app/shared-services/data.service";
import { UserPermissionKey } from "app/enums/user-permission-key.enum";

@Component({
    selector: 'service-request-offline-body',
    styles: [],
    templateUrl: './service-request-offline-body.component.html'
})

export class ServiceRequestOfflineBodyComponent implements OnChanges, OnInit {
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;
    @Input('documents') serviceTypeDocuments: ServiceRequestTypeDocumentModel[] = [];
    @Input('policydetail') policyDetail: PolicyModel = null;
    @Input('dataitems') dataItems: KeyValueModel[] = [];
    @Input('isuploadtabvisible') isUploadTabVisible: boolean = false;
    @Input('isuploadlinkvisible') isUploadLinkVisible: boolean = true;
    @Input('uploaddoctext') uploadDocText: string = 'Upload form and submit service request';
    @Input('isemailfaxtabvisible') isEmailFaxTabVisible: boolean = false;
    @Input('isemailfaxlinkvisible') isEmailFaxLinkVisible: boolean = true;
    @Input('showlifeannuityfax') showLifeAnnuityFax: boolean = true;
    @Input('showlifefax') showLifeFax: boolean = false;
    @Input('emailfaxdataitems') emailFaxDataItems: KeyValueModel[] = [];
    @Input('showinstructions') showInstructions: boolean = true;
    @Input('downloadfilecode') downloadFileCode: string = '';
    @Input('showbodyheadertext') showBodyHeaderText: boolean = false;
    @Input('bodyheadertext') bodyHeaderText: string = '';
    @Input('premiummode') premiumMode: string = '';

    @Output('onbodyvaluechanged') onBodyValueChanged = new EventEmitter<ServiceRequestBodyModel>();
    @Output('onservicerequestsaved') onServiceRequestSaved = new EventEmitter();
    @Output('onemailfaxoruploadlinkclicked') onEmailFaxOrUploadLinkClicked = new EventEmitter();

    @ViewChild('fileUploadComponent') fileUploadComponent: ElementRef;

    public isAgreedToTerms: boolean = false;
    public bodyModel: ServiceRequestBodyModel = new ServiceRequestBodyModel();
    public fileUploadModel: FileUpload[] = [];
    public serviceRequestDocuments: ServiceRequestDocumentModel[] = [];
    public errorMessage: string = '';
    public userNotAuthorizeErrorMessage: string = '';

    public isNeedToGenerateDownLoadString: boolean = false;
    public isPreviousButtonVisible: boolean = false;

    constructor(
        private router: Router,
        private utility: UtilityService,
        private notification: SnackbarService,
        private spinner: SpinnerService,
        private dataService: DataService,
        public config: AppConfig,
        private service: ServiceRequestService,
        private location: Location) { }

    ngOnInit() {
        if (this.downloadFileCode.trim() == '')
            this.isNeedToGenerateDownLoadString = true;

        if (this.dataService != null && this.dataService.serviceRequestNavigationData != null)
            this.isPreviousButtonVisible = this.dataService.serviceRequestNavigationData.isPreviousShow;
    }


    ngOnChanges(changes: SimpleChanges) {
        const serviceTypeDocuments: SimpleChange = changes.serviceTypeDocuments;
        if (serviceTypeDocuments != undefined && !serviceTypeDocuments.firstChange) {
            this.serviceTypeDocuments = serviceTypeDocuments.currentValue;
            this.renderUploadControls();
        }
        else if(this.serviceTypeDocuments.length > 0)
            this.renderUploadControls();
    }

    private displayUploadSection() {
        this.isUploadTabVisible = true;
        this.isEmailFaxTabVisible = false;
        this.onEmailFaxOrUploadLinkClicked.emit({
            isUploadTabVisible: this.isUploadTabVisible,
            isEmailFaxTabVisible: this.isEmailFaxTabVisible
        });

        //If simulated user has no permission to submit service request, display error message to user 
        if(!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key))
           this.userNotAuthorizeErrorMessage = this.config.getConfig('simulatedUserHasNoPermission');
    }

    private displayMailSection() {
        this.isUploadTabVisible = false;
        this.isEmailFaxTabVisible = true;
        this.onEmailFaxOrUploadLinkClicked.emit({
            isUploadTabVisible: this.isUploadTabVisible,
            isEmailFaxTabVisible: this.isEmailFaxTabVisible
        });
    }

    public readTermsAndConditions(event) {
        this.isAgreedToTerms = event.checked;
    }

    private renderUploadControls() {   
        this.downloadFileCode = "";  
        this.serviceRequestDocuments = []; 
        this.fileUploadModel = [];
        this.serviceTypeDocuments.forEach(x => {
            if(x.premiumMode == null || (x.premiumMode != null && this.premiumMode == x.premiumMode)){
                let file = new FileUpload(x.docId, x.docDesc, x.docContentType, false, '', null, x.isDocRequired);
                this.fileUploadModel.push(file);
                if (this.isNeedToGenerateDownLoadString && x.isDownloadAllow) {
                    let downloadDocument = x.docCode + '||' + x.docName;
                    if (this.downloadFileCode.trim() == '')
                        this.downloadFileCode = downloadDocument;
                    else
                        this.downloadFileCode = this.downloadFileCode + '_' + downloadDocument;
                }

                if (x.isUploadAllow) {
                    let serviceRequestDoc = new ServiceRequestDocumentModel();
                    serviceRequestDoc.documentId = x.docId;
                    serviceRequestDoc.name = x.docName;
                    serviceRequestDoc.description = x.docDesc;
                    serviceRequestDoc.documentTypeId = x.docTypeId;
                    serviceRequestDoc.documentContentType = x.docContentType;
                    serviceRequestDoc.displayOrder = x.docDisplayOrder;
                    this.serviceRequestDocuments.push(serviceRequestDoc);
                }
            }
        });
    }

    public onFileSelected(event: FileUpload) {
        this.fileUploadModel.forEach(x => {
            if (x.id == event.id) {
                x.fileName = event.fileName;
                x.fileValue = event.fileValue;
            }
        });

        this.serviceRequestDocuments.forEach(x => {
            if (x.documentId == event.id) {
                x.documentFileName = event.fileName;
                x.documentContentLength = event.fileValue.size;
            }
        });

        this.emitResult();

        //If simulated user has no permission to submit service request, display error message to user 
        if(!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key))
           this.userNotAuthorizeErrorMessage = this.config.getConfig('simulatedUserHasNoPermission');
    }

    public onInvalidFileSelected(message: string) {
        this.setUpError(message);
        this.emitResult();
    }

    public onSubmitClick(event) {
        var dialogMessage = "Please confirm that you would like to submit this request.";

        //If simulated user has no permission to submit service request, display error message to user 
        //otherwise allow user to submit service request.
        let isSimulatedUserHasPermission = this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key);
        if(!isSimulatedUserHasPermission)
            dialogMessage = this.config.getConfig('simulatedUserHasNoPermission');

        //Submit service request
        this.utility.openDialog('', dialogMessage, 'Previous', 'Submit', !isSimulatedUserHasPermission).subscribe(x => {
            if (x != '1') { //Continue
                if(isSimulatedUserHasPermission){
                    if (this.checkValidation()) {
                        let saveModel = this.service.prepareServiceRequestSaveModel(this.bodyModel.requestTypeId, this.bodyModel.policyNumber, false, this.bodyModel.modelData, null, null, null);
                        if (saveModel != null && this.bodyModel.serviceDocuments.length > 0)
                            saveModel.serviceDocuments = this.bodyModel.serviceDocuments;
                            
                        const formData = new FormData();
                        this.fileUploadModel.forEach(x => {
                            if (x.fileValue != null && x.fileName.length > 0) {
                                formData.append(x.id.toString(), x.fileValue, x.fileName);
                            }
                        });

                        formData.append('model', JSON.stringify(saveModel));
                        this.spinner.start();
                        this.service.submitOfflineServiceRequest(formData)
                            .subscribe(res => {
                                this.spinner.stop();
                                this.errorMessage = res.message;
                                this.onServiceRequestSaved.emit(res);
                            }, error => {
                                this.setUpError(error);
                            });
                    }
                    else
                        this.errorMessage = this.config.getConfig('downloadServiceFileUploadVald');
                }
            }
        });
    }

    private cancelRequest() {
        this.utility.navigateOnCancelServiceRequest();
    }

    private previous() {
        if (this.dataService != null && this.dataService.serviceRequestNavigationData != null && this.dataService.serviceRequestNavigationData.returnUrl != null)
            this.router.navigate([this.dataService.serviceRequestNavigationData.returnUrl]);
        else
            this.cancelRequest();
    }

    public get isValidBody(): boolean {

        let isUniqueFileSelected: boolean = true;
        this.fileUploadModel.forEach(x => {
            if (isUniqueFileSelected && x.fileValue != null) {
                isUniqueFileSelected = this.fileUploadModel.filter(x1 => (x1.fileValue != null && x1.fileValue.name == x.fileValue.name)).length <= 1;
            }
        });
        
        if (isUniqueFileSelected) {
            let filter = this.fileUploadModel.filter(x => (x.isRequired == true && x.fileValue == null) || (x.fileName !='' && x.fileName.toLowerCase().indexOf('.pdf') <= -1) || (x.fileValue != null && x.fileValue.size > 26214400));
            if (filter.length <= 0 && this.isAgreedToTerms)
                return true;
            else
                return false;
        }
        else
            return false;
    }

    private checkValidation(): boolean {
        let result = this.fileUploadModel.filter(x => (x.isRequired == true && x.fileValue == null) || (x.fileName !='' && x.fileName.toLowerCase().indexOf('.pdf') <= -1));
        if (result != null && result.length > 0)
            return false;
        else
            return true;
    }

    private emitResult() {
        this.bodyModel = new ServiceRequestBodyModel(this.serviceType,
            this.isValidBody,
            this.isAgreedToTerms,
            this.policyDetail.policyNumber,
            this.policyDetail.productName,
            this.policyDetail.productSubTypeName,
            this.policyDetail.tpaId, this.serviceRequestDocuments);
        this.onBodyValueChanged.emit(this.bodyModel);
    }

    private setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }
}