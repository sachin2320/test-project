import { CommonModule } from "@angular/common";
import { DashboardComponent } from "app/home/dashboard/dashboard.component";
import { HomeComponent } from "app/home/home.component";
import { HomeRoutingModule } from "app/home/home-routing";
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { NgModule } from '@angular/core';
import { PolicyListComponent } from "app/policy/policy-list/policy-list.component";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialDesignModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    PolicyListComponent
  ]
})

export class HomeModule {}
