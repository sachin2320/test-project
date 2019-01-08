import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { ServiceRequestType } from "app/enums/service-type.enum";

@Component({
    selector: 'change-beneficiary-instructions',
    templateUrl: './instructions.component.html'
})

export class ChangeBeneficiaryInstructionsComponent {
    public serviceType: ServiceRequestType = ServiceRequestType.None;

    constructor(private route: ActivatedRoute) {
        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined) {           
            this.serviceType = this.route.snapshot.params.serviceRequestType || "";
        }
    }
}