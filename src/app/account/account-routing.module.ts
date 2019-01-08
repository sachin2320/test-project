import { AccountComponent } from "app/account/account.component";
import { AccountActionComponent } from "app/account/account-action/account-action.component";
import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { PaymentModeComponent } from "app/account/payment-mode/paymentMode.component";
import { Routes, RouterModule } from '@angular/router';

export const AccountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'action', component: AccountActionComponent, canActivate: [AuthGuardService] },
      { path: 'paymentMode', component: PaymentModeComponent, canActivate: [AuthGuardService] },     
    ]
  }
];

export const AccountRoutingModule = RouterModule.forChild(AccountRoutes);
