import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { AppConfig } from 'app/configuration/app.config';
import { ColumnType } from 'app/enums/column-type.enum';
import { GridColumnModel } from 'app/models/gridColumn.model';
import { GridDataModel } from 'app/models/gridData.model';
import { GridRowModel } from 'app/models/gridRow.model';
import { PolicyDocument } from 'app/models/policyDocument.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { PolicyService } from 'app/services/policy/policy.service';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { SpinnerService } from 'app/shared-services/spinner.service';

@Component({
    selector: 'policy-document',
    moduleId: module.id,
    templateUrl: 'policy-document.component.html',
})
export class PolicyDocumentComponent implements OnInit {
    @Input() policyNumber: string;

    public policyDocuments: PolicyDocument[] = []
    public isDataLoadComplete: boolean = false;
    public isDataLoading: boolean = false;

    public dataSource: GridRowModel[] = [];
    public columns: GridColumnModel[] = [];


    constructor(private utility: UtilityService,
        private policyService: PolicyService,
        private notification: SnackbarService,
        public config: AppConfig,
        private spinner: SpinnerService) { }

    ngOnInit() {
        if (this.policyNumber != undefined)
            this.getPolicyDocuments(this.policyNumber);
    }

    getPolicyDocuments(policyNumber: string) {
        this.dataSource = [];
        this.columns = [];
        this.isDataLoading = true;
        this.isDataLoadComplete = false;

        this.policyService.getPolicyDocumentList(policyNumber)
            .subscribe(results => {
                this.policyDocuments = results;
                this.populateGridData();
                this.isDataLoading = false;
                this.isDataLoadComplete = true;
            },
                error => {
                    this.isDataLoading = false;
                    this.isDataLoadComplete = true;
                    this.notification.popupSnackbar(error);
                });
    }

    populateGridData() {
        this.columns.push(new GridColumnModel("documentName", "Document type"));
        this.columns.push(new GridColumnModel("createdDate", "Date created"));

        this.policyDocuments.forEach(element => {
            let policyDocUrl = this.config.getConfig("apiBaseUrl") + this.config.getConfig('policyDocumentUrl')
                .replace("{policyNumber}", element.policy).replace("{policyDocumentId}", element.documentId);

            let rowData: GridDataModel[] = [];
            let params: string[] = [element.policy, element.documentId, element.documentType];

            rowData.push(new GridDataModel(element.documentName, ColumnType.Text, "", "", policyDocUrl, "", params, true));
            rowData.push(new GridDataModel(element.createdDate, ColumnType.Date));
            this.dataSource.push(new GridRowModel(rowData));
        });
    }

    linkClicked(row: GridRowModel) {
        var params = row.columns[0].params; // Fetching param for row.
        let policyNumber = params[0];
        let policyDocId = params[1];
        let policyDocType = params[2];
        let docName = row.columns[0].value;
        this.spinner.start();

        //for android devices download document directly
        //if (navigator.userAgent.match(/Android/i)) {
        if (navigator.platform.match(/Android/i)) {
            this.policyService.getPolicyDocument(policyNumber, policyDocId.replace(".PDF", "_PDF").replace(".pdf", "_pdf"), false, policyDocType)
                .subscribe(res => {
                    this.spinner.stop();
                    saveAs(res, docName + ".pdf");
                },
                    error => {
                        this.spinner.stop();
                        this.utility.openDialog("Download", this.config.getConfig('download_error'), "", "Ok").subscribe(x => { });
                    });
        }
        else {
            //for other devices except android, open document in new tab  
            var proxyTarget = "serviceRequestPDFWindow";
            //To fix ALM #439 issue (cross origin issue was coming), now in all browsers we are opening pdf in new tab.      
            //Earlier to fix ALM #402, we did it for IE11 & edge when user was clicking on download doc button multiple times, browser was sending GET &     
            //In IE11 & edge when user was clicking on download doc button multiple times, browser was sending GET & 
            //POST request alternatively, but post request was required to refresh already opened pdf.
            //So, in order to make POST request in IE11 & edge pdf needs to be open in new window.
            
            proxyTarget = proxyTarget + "_" + this.utility.getGuid();  
            var win = window.open('', proxyTarget);          
            // win.document.write("Loading document... Please wait.");
            win.document.write("Loading document... Please wait. </br> <image src='assets/images/spinner.gif' />");
            
            this.policyService.getPolicyDocument(policyNumber, policyDocId.replace(".PDF", "_PDF").replace(".pdf", "_pdf"), true, policyDocType)
                .subscribe(res => {
                    this.spinner.stop();
                    this.utility.downloadDocument(res, docName, win, proxyTarget);
                },
                    error => {
                        win.close();
                        this.spinner.stop();
                        this.utility.openDialog("Download", this.config.getConfig('download_error'), "", "Ok").subscribe(x => { });
                    });
        }
    }
}