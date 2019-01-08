import { OnInit, Component, Input } from "@angular/core";
import { ServiceRequestHeaderModel } from "app/models/serviceRequestHeader.model";

@Component({
    selector: 'servicerequest-offline-header',
    styles: [],
    templateUrl: './service-request-offline-header.component.html'
})

export class ServiceRequestOfflineHeaderComponent implements OnInit {
    @Input('model') headerModel: ServiceRequestHeaderModel = null;


    constructor() {       
        if (this.headerModel == null)
            this.headerModel = new ServiceRequestHeaderModel();
    }

    ngOnInit() { }
}