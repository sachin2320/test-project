import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyPolicyDocumentComponent } from 'app/policy/my-policy-document/my-policy-document.component';
import { DynamicPolicyTabComponent } from "app/policy/policy-view/dynamic-policy-tab/dynamic-policy-tab.component";
import { DynamicPolicyViewComponent } from "app/policy/policy-view/dynamic-policy-view/dynamic-policy-view.component";
import { PolicyDetailComponent } from "app/policy/policy-view/policy-detail/policy-detail.component";
import { PolicyDocumentComponent } from "app/policy/policy-view/policy-document/policy-document.component";
import { PolicyGmwbStrategyComponent } from "app/policy/policy-view/policy-gmwb-strategy/policy-gmwb-strategy.component";
import { PolicyIncomingPremiumComponent } from "app/policy/policy-view/policy-incoming-premium/policy-incoming-premium.component";
import { PolicyStrategyComponent } from "app/policy/policy-view/policy-strategy/policy-strategy.component";
import { PolicyViewComponent } from "app/policy/policy-view/policy-view.component";
import { PolicyWithdrawalComponent } from "app/policy/policy-view/policy-withdrawal/policy-withdrawal.component";
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { SharedModule } from "app/shared/shared.module";
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MaterialDesignModule,
    PolicyRoutingModule
  ],
  declarations: [
    PolicyComponent,
    PolicyViewComponent,
    PolicyDetailComponent,
    PolicyStrategyComponent,
    PolicyWithdrawalComponent,
    PolicyDocumentComponent,
    PolicyIncomingPremiumComponent,
    PolicyGmwbStrategyComponent,
    MyPolicyDocumentComponent,
    DynamicPolicyViewComponent,
    PolicyDocumentComponent,
    DynamicPolicyTabComponent,
    MyPolicyDocumentComponent
  ]
})

export class PolicyModule { }
