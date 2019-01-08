import { Component, OnInit, ViewChild } from '@angular/core';
import { PolicyService } from 'app/services/policy/policy.service';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { SpinnerService } from 'app/shared-services/spinner.service';
import { PolicyModel } from 'app/models/policy.model';
import { PolicyUsageIndicator } from 'app/enums/policy-usage-indicator.enum';


@Component({
    selector: 'my-policy-document',
    styles: [],
    templateUrl: './my-policy-document.component.html'
})

export class MyPolicyDocumentComponent implements OnInit {
    public policies: PolicyModel[] = [];
    public policyNumber: string=""; 
   @ViewChild("policyDocumentComponent") policyDocumentComponent: { getPolicyDocuments(policyNumber: string) };
    
    constructor(public service: PolicyService,
        private notification: SnackbarService,
        private spinner: SpinnerService) { }

    ngOnInit() {
        this.getUserPolicies();
    }

    getUserPolicies() {
        this.spinner.start();
        this.service.getUserPolicies(PolicyUsageIndicator.PolicyDocuments,this.policyNumber)
            .subscribe(results => {
                this.policies = results;
                if (results.length == 1) {
                    this.policyNumber = results[0].policyNumber;
                    this.policyDocumentComponent.getPolicyDocuments(this.policyNumber);        
                }

                this.spinner.stop();
            },
            error => {
                this.notification.popupSnackbar(error);
                this.spinner.stop();
            });
    }

    onPolicyChange(event: any)
    {
        this.policyNumber = event.value;   
        this.policyDocumentComponent.getPolicyDocuments(event.value);        
    }
}
