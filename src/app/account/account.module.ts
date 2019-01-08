import { AccountActionComponent } from "app/account/account-action/account-action.component";
import { AccountComponent } from "app/account/account.component";
import { AccountRoutingModule } from "app/account/account-routing.module";
import { CommonModule } from '@angular/common';
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { NgModule } from '@angular/core';
import { PaymentModeComponent } from "app/account/payment-mode/paymentMode.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    AccountComponent,
    AccountActionComponent,
    PaymentModeComponent,
  ]
})

export class AccountModule { }
