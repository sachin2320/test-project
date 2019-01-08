import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { DynamicPolicyInfoModel, PolicyType } from 'app/models/dynamicPolicyInfo.model';

@Component({
    selector: 'dynamic-policy-view',
    styles: [],
    templateUrl: './dynamic-policy-view.component.html'
})

export class DynamicPolicyViewComponent implements OnInit {
    @Input() policyInfo: DynamicPolicyInfoModel;
    @Input() policyType: string;

    public isDataLoadCompleted: boolean = false;
    public errorMessage: string = '';
    public policyNumber: string = '';
    private policyTabValue: number = 0;

    public PolicyType = PolicyType;

    constructor(private route: ActivatedRoute) {
        var queryParam = this.route.snapshot.params;
        if (queryParam != null && queryParam != undefined) {
            this.policyTabValue = queryParam.policyTabValue ? queryParam.policyTabValue : 0;
        }
    }

    ngOnInit() {
        this.isDataLoadCompleted = true;
        this.policyNumber = this.policyInfo.policyNumber;
    }
}
