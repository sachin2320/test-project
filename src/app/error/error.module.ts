import { NgModule } from '@angular/core';
import { ErrorRoutingModule } from 'app/error/error-routing';
import { FglErrorComponent } from 'app/error/error-component/error-component';
import { ErrorComponent } from 'app/error/error.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialDesignModule } from 'app/shared/material-design.module';


@NgModule({
  imports: [    
    CommonModule,
    SharedModule,
    MaterialDesignModule,
    FormsModule,
    ErrorRoutingModule
  ],
  declarations: [
    FglErrorComponent,    
    ErrorComponent, 
  ]
})

export class ErrorModule {}
