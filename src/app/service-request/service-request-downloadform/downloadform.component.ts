import { Component, OnInit, Input } from '@angular/core';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { AppConfig } from 'app/configuration/app.config';
import { ServiceRequestService } from 'app/services/service-request/service-request.service';
import { saveAs } from '@progress/kendo-file-saver';
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'download-form',
    styles: [],
    templateUrl: './downloadform.component.html'
})

export class DownloadFormComponent implements OnInit {
    @Input('downloadfilecode') downloadFileCode: string = "";
    public docuCodes: DownloadFormItem[] = [];   

    constructor(public config: AppConfig,
        private spinner: SpinnerService,
        private serviceRequest: ServiceRequestService,
        private utility: UtilityService) {
    }

    ngOnInit() {
        this.downloadFileCode.split('_').forEach(x => {
            let docDetail = x.split('||');
            this.docuCodes.push(new DownloadFormItem(docDetail[0], docDetail[1]));
        });
    }

    downloadFile(fileCode: string) {
        this.spinner.start();     
        //for android devices download document directly
        if (navigator.platform.match(/Android/i)) {          
            this.serviceRequest.getServiceRequestDownloadFile(fileCode, false)
                .subscribe(res => {
                    this.spinner.stop();
                    saveAs(res, fileCode + ".pdf");
                },
                error => {                  
                    this.spinner.stop();
                    this.utility.openDialog("Download", this.config.getConfig('download_error'), "", "Ok").subscribe(x => { });
                });
        }
        else { 
            //for other devices except android, open document in new tab  
            var proxyTarget = "serviceRequestPDFWindow";
            //Fix for ALM #402. Now in IE & edge we are opening pdf in new tab.      
            //In IE11 & edge when user was clicking on download form button multiple times, browser was sending GET & 
            //POST request alternatively, but post request was required to refresh already opened pdf.
            //So, in order to make POST request in IE11 & edge pdf needs to be open in new window.

            if (navigator.userAgent.match(/Trident/i) || navigator.userAgent.match(/Edge/i)) {
                proxyTarget = proxyTarget + "_" + this.utility.getGuid();                
            }

            var win = window.open('', proxyTarget);

            this.serviceRequest.getServiceRequestDownloadFile(fileCode, true)
                .subscribe(res => {
                    this.spinner.stop();
                    this.utility.downloadDocument(res, fileCode, win, proxyTarget);
                },
                error => {
                    win.close();
                    this.spinner.stop();
                    this.utility.openDialog("Download", this.config.getConfig('download_error'), "", "Ok").subscribe(x => { });
                });
        }
    }
}

export class DownloadFormItem {
    constructor(public code: string, public name: string) { }
}