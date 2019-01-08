import { AccountActionComponent } from "app/account/account-action/account-action.component";
import { AccountComponent } from "app/account/account.component";
import { AccountRoutingModule } from "app/account/account-routing.module";
import { CommonModule } from '@angular/common';
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { NgModule } from '@angular/core';
import { PaymentModeComponent } from "app/account/payment-mode/paymentMode.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { StatementComponent } from "app/statement/statement.component";
import { StatementDetailComponent } from "app/statement/statement-detail/statement-detail.component";
import { StatementRoutingModule } from "app/statement/statement-routing.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    StatementRoutingModule
  ],
  declarations: [
    StatementComponent,
    StatementDetailComponent
  ]
})

export class StatementModule { }
