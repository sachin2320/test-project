import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ServiceRequestModel } from "app/models/serviceRequest.model";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { AppConfig } from "app/configuration/app.config";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { ServiceRequestUsageIndicator } from 'app/enums/service-request-usage-indicator.enum';
import { UtilityService } from "app/services/helper/utility.service";
import { DataService } from 'app/shared-services/data.service';

@Component({
    selector: 'fgl-serviceRequest',
    templateUrl: './serviceList.component.html'
})

export class ServiceListComponent implements OnInit {
    @Input('indicator') usageIndictor: ServiceRequestUsageIndicator ;

    public serviceRequests: ServiceRequestModel[] = [];
    public dateFormat: string;
    public isDataloadCompleted: boolean = false;

    @Output('ondataloadcomplete')
    dataLoadComplete = new EventEmitter();

    constructor(private ticketService: ServiceRequestService,
        public config: AppConfig,
        private notification: SnackbarService,
        private utility: UtilityService,
        private dataService: DataService) {
        this.dateFormat = this.config.getConfig("date_format");
    }

    ngOnInit() {
        //Clearing serviceRequestNavigationData for new service requests
        this.dataService.serviceRequestNavigationData = null;

        this.ticketService.getTicketList(this.usageIndictor).subscribe(results => {
            this.isDataloadCompleted = true;
            this.serviceRequests = results;
            this.dataLoadComplete.emit();
        }, error => {
            this.isDataloadCompleted = true;
            this.notification.popupSnackbar(error);
        });
    }
}