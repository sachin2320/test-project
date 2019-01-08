import { CommonModule } from "@angular/common";
import { ContactComponent } from 'app/contact-us/contact.component';
import { ContactRoutingModule } from 'app/contact-us/contact-routing';
import { ContactUsComponent } from 'app/contact-us/contact/contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialDesignModule,
    ContactRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ContactComponent,
    ContactUsComponent    
  ]
})

export class ContactModule {}
