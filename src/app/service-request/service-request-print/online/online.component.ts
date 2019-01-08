import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { ColumnType } from 'app/enums/column-type.enum';
import { GridColumnModel } from 'app/models/gridColumn.model';
import { GridDataModel } from 'app/models/gridData.model';
import { GridRowModel } from 'app/models/gridRow.model';
import { ServiceRequestModel } from "app/models/serviceRequest.model";
import { ServiceRequestFooterModel } from "app/models/serviceRequesterFooter.model";
import { ServiceRequestHeaderModel } from "app/models/serviceRequestHeader.model";
import { UtilityService } from "app/services/helper/utility.service";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Subject } from "rxjs";

@Component({
    selector: 'service-request-print',
    styles: [],
    templateUrl: './online.component.html'
})

export class ServiceRequestPrintComponent implements OnInit {

    public isViewOnly: boolean = true;
    public errorMessage: string;
    public dateFormat: string;
    public timeFormat: string;

    public headerModel: ServiceRequestHeaderModel = null;
    public footerModel: ServiceRequestFooterModel = null;
    public detailModel: ServiceRequestModel = null;

    public xrefId: number;
    public styles: string;    
    
    public dataSource: GridRowModel[] = [];
    public columns: GridColumnModel[] = [];    

    @Output('loadcompleted')
    loadCompleted = new EventEmitter();
    loadSubscriber: Subject<boolean> = new Subject<boolean>();
 
    constructor(public utility: UtilityService,
        private spinner: SpinnerService,
        public config: AppConfig,
        private notification: SnackbarService,
        private serviceRequest: ServiceRequestService,
        private route: ActivatedRoute,
        private router: Router,
        private injector: Injector, public elementRef: ElementRef, public renderer: Renderer) {
        //  bodyElement/
        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined && this.route.snapshot.params.zendeskRequestId != undefined) {
            this.xrefId = this.route.snapshot.params.zendeskRequestId || 0;          
            //TODO : If zendeskRequestId is null then show invalida page/request error 
        }
        else {
            //This value will come from ComponentFactoryResolver which will get inject by the calling page, if need to call dynamically.
            this.xrefId = this.injector.get('zendeskRequestId');
            this.styles = this.injector.get('styles');
        }

        this.headerModel = new ServiceRequestHeaderModel();
        this.detailModel = new ServiceRequestModel();
        this.footerModel = new ServiceRequestFooterModel();

        this.dateFormat = this.config.getConfig("date_format");
        this.timeFormat = this.config.getConfig("time_format");
    }

    ngOnInit() {
        let cssPath = this.styles;
        if (cssPath != undefined || cssPath != '')
            this.setupCss(cssPath);

        if (this.xrefId > 0)
            this.getServiceRequestDetail();
        else
            return;
        //TODO : If zendeskRequestId is null then show invalida page/request error
    }

    private setupHeader() {
        this.headerModel = new ServiceRequestHeaderModel(
            this.detailModel.entityName == "" ? (this.detailModel.firstName + " " + this.detailModel.lastName) : this.detailModel.entityName,
            this.detailModel.policyNumber,
            this.detailModel.email,
            this.detailModel.phone,
            this.utility.getServiceRequestDisplayName(this.detailModel.requestTypeId), "",
            this.utility.getServiceRequestHeaderText(this.detailModel.requestTypeId),
            "",
            "",
            (this.detailModel.socialSecurityNumber != null && this.detailModel.socialSecurityNumber != ""),
            this.detailModel.socialSecurityNumber
        );
    }

    private setupFooter() {
        this.footerModel = new ServiceRequestFooterModel(this.detailModel.ownerInitials,
            this.detailModel.ownerDob,
            this.detailModel.ownerLast4Ssn, "", false, this.footerModel.authorizationChkBoxItems);
    }

    private getServiceRequestDetail() {
        this.spinner.start();
        this.serviceRequest.getServiceRequestDetails(0, this.xrefId).subscribe(res => {
            this.spinner.stop();
            if (res.isSuccess) {
                let results: ServiceRequestModel[] = res.data.requestDetails;
                if (results.length > 0) {
                    if(results[0].serviceRequestHTML) { 
                        results[0].serviceRequestHTML = 
                        results[0].serviceRequestHTML.replace(/<\/b>/g,'</b>&nbsp;').replace(/<\/strong>/g,'</strong>&nbsp;');
                    }
                    this.detailModel = results[0];
                    for(let item=0;item<results[0].requestDisclosure.length;item++) {
                        if(results[0].requestDisclosure[item].disclosureText) {
                        results[0].requestDisclosure[item].disclosureText = 
                        results[0].requestDisclosure[item].disclosureText.replace(/<\/b>/g,'</b>&nbsp;').replace(/<\/strong>/g,'</strong>&nbsp;');
                        }
                    }
                    this.footerModel.authorizationChkBoxItems = results[0].requestDisclosure;
                }
                else
                    this.detailModel = new ServiceRequestModel();

                this.setupHeader();
                this.setupDocsList();
                this.setupFooter();
            }
            else {
                this.setUpError(res.message);
            }
            this.raiseLoadCompleted();
        },
            error => {
                this.setUpError(error);
                this.raiseLoadCompleted();
            });
    }

    private setUpError(msg: string) {
        this.spinner.stop();
        this.errorMessage = msg;
        this.notification.popupSnackbar(msg);
    }

    private raiseLoadCompleted() {
        this.loadCompleted.emit();
        this.loadSubscriber.next(true);
    }

    private setupCss(cssPath: string) {
        let styleElement = this.renderer.createElement(this.elementRef.nativeElement, "link");
        styleElement.setAttribute("rel", "stylesheet")
        styleElement.setAttribute("type", "text/css")
        styleElement.setAttribute("href", this.styles)

        this.renderer.createText(styleElement, '');
    }

    private setupDocsList() {  
        this.dataSource = [];
        this.columns = [];  
                 
        let rowColumns: GridDataModel[] = [];
        this.columns.push(new GridColumnModel("documentFileName", "File Name", "padding-left5 print-col-5"));
        this.columns.push(new GridColumnModel("description", "Description", "print-col-3"));
        this.columns.push(new GridColumnModel("", "Date Added", "print-col-1"));

        this.detailModel.serviceDocuments.forEach(element => {
            let rowData: GridDataModel[] = [];
            rowData.push(new GridDataModel(element.documentFileName, ColumnType.Text, "word-break print-col-5"));
            rowData.push(new GridDataModel(element.description, ColumnType.Text, "word-break print-col-3"));
            rowData.push(new GridDataModel(element.createdOn, ColumnType.Date, "print-col-1"));
            this.dataSource.push(new GridRowModel(rowData));
        });
    }
}