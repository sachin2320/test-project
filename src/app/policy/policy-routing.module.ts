import { Routes, RouterModule } from '@angular/router';
import { PolicyComponent } from './policy.component';
import { PolicyViewComponent } from './policy-view/policy-view.component';
import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { MyPolicyDocumentComponent } from 'app/policy/my-policy-document/my-policy-document.component';

export const PolicyRoutes: Routes = [
  {
    path: '',
    component: PolicyComponent,
    children: [    
      { path: 'view/:policyNumber/:policyType', component: PolicyViewComponent, canActivate: [AuthGuardService]},
      { path: 'view/:policyNumber/:policyType/:policyTabValue', component: PolicyViewComponent, canActivate: [AuthGuardService]},
      { path: 'my-document', component: MyPolicyDocumentComponent, canActivate: [AuthGuardService]},
    ]
  }
];

export const PolicyRoutingModule = RouterModule.forChild(PolicyRoutes);
