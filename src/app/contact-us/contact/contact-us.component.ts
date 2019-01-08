import { AccountService } from 'app/services/account/account.service';
import { AppConfig } from 'app/configuration/app.config';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FileUpload } from 'app/models/fileUpload.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';
import { RegistrationModel } from 'app/models/Registration.model';
import { ActivatedRoute } from '@angular/router';
import { ServiceRequestDocumentModel } from 'app/models/serviceRequestDoument.model';
import { ServiceRequestFooterModel } from 'app/models/serviceRequesterFooter.model';
import { ServiceRequestHeaderModel } from 'app/models/serviceRequestHeader.model';
import { ServiceRequestService } from 'app/services/service-request/service-request.service';
import { ServiceRequestType } from 'app/enums/service-type.enum';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { UtilityService } from 'app/services/helper/utility.service';
import { Validation } from 'app/shared-services/validation.service';
import { UserPermissionKey } from 'app/enums/user-permission-key.enum';

/* This component is used to display "Contact Us" page */
@Component({
  selector: 'fgl-contactus',
  templateUrl: './contact-us.component.html'
})

export class ContactUsComponent {

  public policies: any[] = [];
  public policy: string = "";

  public errorMessage: string;
  public userNotAuthorizeErrorMessage: string = '';
  public isRequestSubmitted: boolean = false;

  contactUsForm: FormGroup = null;

  public fileUploadModel: FileUpload[] = [];
  public serviceDocuments: ServiceRequestDocumentModel[] = [];
  public userModel: RegistrationModel = null;
  @ViewChild("fileUploadComponent") fileUploadComponent: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private serviceRequest: ServiceRequestService,
    private spinner: SpinnerService,
    public config: AppConfig,
    private notification: SnackbarService,
    private utility: UtilityService,
    private accountService: AccountService) {
    this.route
      .queryParams
      .subscribe(params => {
        this.policy = params['policyNumber'] || '';
      });
    this.userModel = new RegistrationModel();
    this.serviceDocuments = this.utility.getServiceRequestDocumentModel(ServiceRequestType.ContactUs);
  }

  ngOnInit() {
    this.serviceDocuments.forEach(doc => {
      this.fileUploadModel.push(new FileUpload(doc.documentId, doc.name, doc.documentContentType, true, "", null, false));
    });
    this.getUserAccountDetails();
    this.setUpForm();
    this.getPolicies();

    //If simulated user has no permission to submit contact us service request, display error message to user 
    if(!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_contactus_key))
       this.userNotAuthorizeErrorMessage = this.config.getConfig('simulatedUserHasNoPermission');
  }
  getUserAccountDetails() {
    this.spinner.start();
    this.accountService.getAccountDetail().subscribe(res => {
      if (res != null) {
        this.userModel = res;
        this.spinner.stop();
      }
      else {
        this.setUpError("Some thing gone wrong!!");
      }
    }, error => {
      this.setUpError(error);
    });
  }
  getPolicies() {
    this.spinner.start();
    this.serviceRequest.getServiceRequestPolicyList(PolicyUsageIndicator.ContactUs).subscribe(res => {
      if (res.isSuccess) {
        this.policies = res.data.policyList;
        this.spinner.stop();
      }
      else {
        this.setUpError(res.message);
      }
    }, error => {
      this.setUpError(error);
    });
  }

  setUpForm() {
    this.contactUsForm = this.formBuilder.group({
      policy: [this.policy, Validators.required],
      subject: ['', [Validators.required, Validation.ValidateRequiredWithNoEmptySpaceInput]],
      comment: ['', [Validators.required, Validation.ValidateRequiredWithNoEmptySpaceInput]]
    });
  }

  submitForm() {   
    //If simulated user has no permission to submit contact us service request, display error message to user 
    //otherwise allow user to submit contact us service request.
    if(!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_contactus_key))
    {
       this.userNotAuthorizeErrorMessage = this.config.getConfig('simulatedUserHasNoPermission');
       return false;
    }

    //Submit contact us service request
    let controls = this.contactUsForm.controls;
    let policyNumber = controls["policy"].value;
    let subject = controls["subject"].value;
    let userComment = controls["comment"].value;

    let bodyData = { UserComment: userComment, Subject: subject };   
    let footer = new ServiceRequestFooterModel();
    let header = new ServiceRequestHeaderModel();
    let saveModel = this.serviceRequest.prepareServiceRequestSaveModel(ServiceRequestType.ContactUs, policyNumber, true, bodyData, footer, header, "");
    if (saveModel != null)
      saveModel.serviceDocuments = this.serviceDocuments;

    const formData = new FormData();
    this.fileUploadModel.forEach(x => {
      if (x.fileValue != null) {
        formData.append(x.id.toString(), x.fileValue, x.fileName);
      }
    });
    formData.append("model", JSON.stringify(saveModel));

    this.spinner.start();
    this.serviceRequest.submitServiceRequest(formData).subscribe(res => {
      this.spinner.stop();
      if (res.isSuccess) {
        this.isRequestSubmitted = true;
      }
      else {
        this.setUpError(res.message);
      }
    }, error => { this.setUpError(error); });
  }

  setUpError(msg: string) {
    this.spinner.stop();
    this.errorMessage = msg;
    this.notification.popupSnackbar(msg);
  }

  onFileSelected(event: FileUpload) {
    this.fileUploadModel[0] = event;

    //Updating selected file in service documents
    var filterDoc = this.serviceDocuments.filter(doc => doc.documentId == event.id);
    if (filterDoc != null && filterDoc.length > 0) {
      filterDoc[0].documentFileName = event.fileName;
      filterDoc[0].documentContentLength = event.fileValue.size;
    }

    //If simulated user has no permission to submit contact us service request, display error message to user 
    if(!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_contactus_key))
       this.userNotAuthorizeErrorMessage = this.config.getConfig('simulatedUserHasNoPermission');
  }

  onInvalidFileSelected(message: string) {
    this.setUpError(message);
  }

  get isPageValid(): boolean {
    var filterDoc = this.serviceDocuments.filter(doc => (doc.documentFileName != '' && doc.documentFileName.toLowerCase().indexOf('.pdf') <= -1));
    // ALM-132 Showing an inappropriate error message on attaching more than 25 mb file. (Issue on IPad and Browser)
    // return this.contactUsForm.valid && filterDoc.length <=0;
    return this.contactUsForm.valid && filterDoc.length <= 0 && (!this.errorMessage || this.errorMessage.length <= 0);
  }
}
