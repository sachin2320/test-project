import { Component, Input } from '@angular/core';
import { AppConfig } from 'app/configuration/app.config';
import { PolicyTab } from "app/models/dynamicPolicyInfo.model";
import { UtilityService } from 'app/services/helper/utility.service';

@Component({
    selector: 'dynamic-policy-tab',
    templateUrl: './dynamic-policy-tab.component.html'
})

export class DynamicPolicyTabComponent {
    @Input('model') model: PolicyTab = null;
    @Input('policynumber') policyNumber: string = "";
    @Input('policyownercount') policyOwnerCount: number;
    
    constructor(public config: AppConfig, 
        private utility: UtilityService) {           
        if (this.model == null)
            this.model = new PolicyTab();
    }

    ngOnInit() {      
    }

    navigatetoChangeInfo(policyOwnerCount, policyNumber, serviceType) {
        this.utility.saveReturnUrlForCancelServiceRequestNavigation();
        this.utility.navigateUserToServiceRequest(policyOwnerCount, policyNumber, serviceType);
    }
   
}