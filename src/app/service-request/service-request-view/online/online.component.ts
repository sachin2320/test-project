import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from "app/configuration/app.config";
import { ColumnType } from 'app/enums/column-type.enum';
import { ErrorType } from 'app/enums/error-type.enum';
import { UserPermissionKey } from 'app/enums/user-permission-key.enum';
import { GridColumnModel } from 'app/models/gridColumn.model';
import { GridDataModel } from 'app/models/gridData.model';
import { GridRowModel } from 'app/models/gridRow.model';
import { ServiceRequestModel } from "app/models/serviceRequest.model";
import { ServiceRequestCommentModel } from "app/models/serviceRequestComment.model";
import { ServiceRequestHeaderModel } from "app/models/serviceRequestHeader.model";
import { UtilityService } from "app/services/helper/utility.service";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";

@Component({
    selector: 'service-request-view',
    styles: [],
    templateUrl: './online.component.html'
})

export class ServiceRequestViewComponent implements OnInit {
    public isDataLoadCompleted: boolean = false;
    public isViewOnly: boolean = true;
    public isSrDetailOnly: boolean = true;
    public errorMessage: string;
    public dateFormat: string;
    public timeFormat: string;

    public headerModel: ServiceRequestHeaderModel;
    public serviceRequestModel: ServiceRequestModel;
    public zendeskCommentModel: ServiceRequestCommentModel[] = [];

    public dataSource: GridRowModel[] = [];
    public columns: GridColumnModel[] = [];

    public xrefId: number;
    public userComment: string = "";

    constructor(private utility: UtilityService,
        private spinner: SpinnerService,
        public config: AppConfig,
        private notification: SnackbarService,
        private serviceRequest: ServiceRequestService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location) {

        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined) {
            this.xrefId = this.route.snapshot.params.zendeskRequestId || 0;
            //TODO :  If zendeskRequestId is null then show invalida page/request error
        }

        this.headerModel = new ServiceRequestHeaderModel();
        this.serviceRequestModel = new ServiceRequestModel();

        this.dateFormat = this.config.getConfig("date_format");
        this.timeFormat = this.config.getConfig("time_format");
    }

    ngOnInit() {
        if (this.xrefId > 0)
            this.getServiceRequestDetail();
        else
            return;
        //TODO :  If zendeskRequestId is null then show invalid page/request error

        //If simulated user has no permission to submit service request, display error message to user 
        if (!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key))
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
    }


    setupHeader() {       
        this.headerModel = new ServiceRequestHeaderModel(
            this.serviceRequestModel.entityName == "" ? (this.serviceRequestModel.firstName + " " + this.serviceRequestModel.lastName) : this.serviceRequestModel.entityName,
            this.serviceRequestModel.policyNumber,
            this.serviceRequestModel.email,
            this.serviceRequestModel.phone,
            this.utility.getServiceRequestDisplayName(this.serviceRequestModel.requestTypeId),
            "",
            "",
            "",
            "",
            (this.serviceRequestModel.socialSecurityNumber != null && this.serviceRequestModel.socialSecurityNumber != ""),
            this.serviceRequestModel.socialSecurityNumber
        );
    }

    setupStatus() {
        switch (this.serviceRequestModel.requestStatus) {
            case "New":
                this.serviceRequestModel.requestStatus = "Submitted";
                break;
            case "Open":
                this.serviceRequestModel.requestStatus = "In Progress";
                break;
            case "On-Hold":
                this.serviceRequestModel.requestStatus = "Pending Response";
                break;
            case "Solved":
                this.serviceRequestModel.requestStatus = "Closed";
                break;
            case "Closed":
                this.serviceRequestModel.requestStatus = "Closed";
                break;
        }
    }

    getServiceRequestDetail() {
        this.isDataLoadCompleted = false;
        this.spinner.start();
        this.serviceRequest.getServiceRequestDetails(0, this.xrefId).subscribe(res => {
            this.spinner.stop();
            if (res.isSuccess) {
                let results: ServiceRequestModel[] = res.data.requestDetails;
                if (results.length > 0) {
                    this.serviceRequestModel = results[0];
                    this.setupHeader();
                    this.setupStatus();
                    this.setupFileList();
                    this.getZendeskComments();
                    this.isDataLoadCompleted = true;
                }
                else {
                    this.utility.navigateToErrorPage(ErrorType.ServiceRequestNotFound);
                }
            }
            else {
                this.utility.navigateToErrorPage(ErrorType.ServiceRequestDetailNotFetch);
            }
        },
            error => {
                this.utility.navigateToErrorPage(ErrorType.InternalServerError);
            });
    }

    getZendeskComments() {
        this.spinner.start();
        this.serviceRequest.getZendeskRequestDetails(this.xrefId).subscribe(res => {
            this.spinner.stop();
            if (res.isSuccess) {
                let comments: ServiceRequestCommentModel[] = [];
                let results = res.data.ticketDetails.commentList;
                if (results.length > 0) {
                    results.forEach(function (result) {
                        comments.push(new ServiceRequestCommentModel(result.id, result.createdBy, result.createdOn, result.body));
                    });
                    this.zendeskCommentModel = comments;
                }
                else
                    this.zendeskCommentModel = [];
            }
            else {
                this.setUpError(res.message);
            }
        },
            error => {
                this.setUpError(error);
            });
    }

    submitComment() {
        //If simulated user has no permission to submit service request, display error message to user 
        //otherwise allow user to submit service request.
        if (!this.utility.isSimulatedUserHasPermission(UserPermissionKey.perm_create_update_view_service_request_key)) {
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
            return false;
        }

        //Submit service request    
        this.spinner.start();
        this.serviceRequest.submitServiceRequestComment(this.xrefId, this.userComment).subscribe(res => {
            this.spinner.stop();
            if (!res.isSuccess) {
                this.setUpError(res.message);
            }
            else {
                this.userComment = "";
                this.getServiceRequestDetail();
            }
        },
            error => {
                this.setUpError(error);
            });
    }

    setupFileList() {
        this.dataSource = [];
        this.columns = [];

        let rowColumns: GridDataModel[] = [];
        this.columns.push(new GridColumnModel("documentFileName", "File Name"));
        this.columns.push(new GridColumnModel("description", "Description"));
        this.columns.push(new GridColumnModel("", "Date Added"));

        this.serviceRequestModel.serviceDocuments.forEach(element => {
            let rowData: GridDataModel[] = [];
            rowData.push(new GridDataModel(element.documentFileName, ColumnType.Text, "word-break"));
            rowData.push(new GridDataModel(element.description, ColumnType.Text, "word-break"));
            rowData.push(new GridDataModel(element.createdOn, ColumnType.Date));
            this.dataSource.push(new GridRowModel(rowData));
        });
    }

    cancelRequest() {      
        this.location.back();
    }

    setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }

    public get isRequestInReadonlyMode(): boolean {
        return this.serviceRequestModel.requestStatus.toLowerCase() == "closed" || this.serviceRequestModel.requestStatus.toLowerCase() == "solved";
    }
}