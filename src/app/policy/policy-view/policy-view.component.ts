import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicPolicyInfoModel, PolicyType } from 'app/models/dynamicPolicyInfo.model';
import { UtilityService } from 'app/services/helper/utility.service';
import { PolicyService } from 'app/services/policy/policy.service';
import { SpinnerService } from 'app/shared-services/spinner.service';


@Component({
  selector: 'policy-view',
  styles: [],
  templateUrl: './policy-view.component.html'
})

export class PolicyViewComponent implements OnInit {  
  public policyType: string = '';  
  public policyInfo : DynamicPolicyInfoModel = null;
  public errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private utility: UtilityService,
    private policyService: PolicyService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    var queryParam = this.route.snapshot.params;
    if (queryParam != null && queryParam != undefined) {
      this.loadPolicy(this.route.snapshot.params.policyNumber || '');
    }
  }

  private loadPolicy(policyNumber: string) {
    this.spinner.start();
    this.policyService.getPolicyDetails(policyNumber)
      .subscribe(res => {
        this.spinner.stop();
        if (res.isSuccess) {     
          this.policyInfo = res.data.policyInfo;
          if (this.utility.validateDynamicPolicy(this.policyInfo)) {
            let policyType = this.policyInfo.type;
            this.policyType = policyType === PolicyType.LIFE ? 'L' : 'A';
          }
        }
        else {
          this.setUpError(res.message);
        }
      },
      error => {
        this.setUpError(error);
      });
  }

  setUpError(msg: string) {
    this.spinner.stop();
    this.errorMessage = msg;
  }
}