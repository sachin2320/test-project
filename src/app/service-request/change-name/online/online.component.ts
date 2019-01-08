import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { FileUpload } from 'app/models/fileUpload.model';
import { ServiceRequestChangeNameModel } from "app/models/serviceRequestChangeName.model";
import { ServiceRequestDocumentModel } from 'app/models/serviceRequestDoument.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { Validation } from "app/shared-services/validation.service";


@Component({
    selector: 'change-name',
    styles: [],
    templateUrl: './online.component.html'
})

export class ChangeNameOnlineComponent implements OnInit {

    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('isprintonly') isPrintOnly: boolean = false;

    public model: ServiceRequestChangeNameModel = null;
    public nameChangeForm: FormGroup = null;
    public userComment: string = "";
    public isPageValid: boolean = false;
    public errorMessage: string;

    public fileUploadModel: FileUpload[] = [];
    public serviceDocuments: ServiceRequestDocumentModel[] = [];

    public changeNameForInsuredOrAnnuitantText: string = "";
    public changeNameForOwnerText: string = "";

    @Output('onvaluechanged') formValue = new EventEmitter();
    @Output('onError') onError = new EventEmitter();

    @ViewChild("fileUploadComponent") fileUploadComponent: ElementRef;

    constructor(private formBuilder: FormBuilder, public config: AppConfig, private utility: UtilityService) {
        this.model = this.model == null ? new ServiceRequestChangeNameModel() : this.model;
        this.serviceDocuments = this.utility.getServiceRequestDocumentModel(ServiceRequestType.ChangeName);
    }

    ngOnInit() {

        this.changeNameForInsuredOrAnnuitantText = this.utility.getConfigText("insuredOrAnnuitant");
        this.changeNameForOwnerText = this.utility.getConfigText("owner");

        this.serviceDocuments.forEach(doc => {
            this.fileUploadModel.push(new FileUpload(doc.documentId, doc.name, doc.documentContentType, true, "", null, true));
        });

        this.setupFormFields();

        //Raising invalid form state event.
        this.formValue.emit({ FormData: this.model });
        this.nameChangeForm.valueChanges.subscribe(form => {
            if (!this.isViewOnly) {
                this.isPageValid = this.nameChangeForm.valid;
                this.model = form;
                this.emitResult();
            }
        });
        this.nameChangeForm.controls["isInsured"].setValue("false");
    }

    setupFormFields() {
        this.nameChangeForm = this.formBuilder.group({
            formerFirstName: [this.model.formerFirstName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            formerLastName: [this.model.formerLastName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            formerMiddleInitials: [this.model.formerMiddleInitials],

            newFirstName: [this.model.newFirstName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            newLastName: [this.model.newLastName, Validation.ValidateRequiredWithNoEmptySpaceInput],
            newMiddleInitials: [this.model.newMiddleInitials],
            isInsured: [(this.model ? true : this.model.isInsured)],
        });
    }

    emitComment(event) {
        this.emitResult(event);
    }

    emitResult(comment: any = "") {
        let result = {
            RequestType: ServiceRequestType.ChangeName,
            ChangeNameData: this.model,
            UploadedFile: this.fileUploadModel,
            ServiceDocuments: this.serviceDocuments,
            IsDataValid: this.pageIsValid && this.isSelectedFileValid,
            UserComment: comment == "" ? this.userComment : comment
        };
        this.formValue.emit(result);
    }

    onFileSelected(event: FileUpload) {
        this.fileUploadModel[0] = event;
        //Updating selected file in service documents
        var filterDoc = this.serviceDocuments.filter(doc => doc.documentId == event.id);
        if (filterDoc != null && filterDoc.length > 0) {
            filterDoc[0].documentFileName = event.fileName;
            filterDoc[0].documentContentLength = event.fileValue.size;
        }
        this.emitResult();
    }

    onInvalidFileSelected(message: string) {
        this.errorMessage = message;
        this.onError.emit(message);
    }

    // ALM-132 Showing an inappropriate error message on attaching more than 25 mb file. (Issue on IPad and Browser)
    // Added " && (!this.errorMessage || this.errorMessage.length <= 0)"
    // Trim leading and trailing whitespace when comparing names.
    get pageIsValid(): boolean {
        return this.isPageValid && (
            this.model.formerFirstName.toLowerCase().trim() != this.model.newFirstName.toLowerCase().trim() ||
            this.model.formerMiddleInitials.toLowerCase().trim() != this.model.newMiddleInitials.toLowerCase().trim() ||
            this.model.formerLastName.toLowerCase().trim() != this.model.newLastName.toLowerCase().trim()) && (
                !this.errorMessage || this.errorMessage.length <= 0);
    }

    get isSelectedFileValid(): boolean {
        return this.fileUploadModel.filter(x => (x.isRequired == true && x.fileValue == null) || (x.fileName !='' && x.fileName.toLowerCase().indexOf('.pdf') <= -1)).length <= 0;
    }

    get getFormerFullName(): string{
        return this.model.formerFirstName + ' ' + this.model.formerMiddleInitials + ' ' + this.model.formerLastName;
    }

    get getNewFullName(): string{
        return this.model.newFirstName + ' ' + this.model.newMiddleInitials + ' ' + this.model.newLastName;
    }

    get changeNameFor(): string{
        return this.nameChangeForm.controls["isInsured"].value == 'true' ? 'Insured' : 'Owner'
    }
}