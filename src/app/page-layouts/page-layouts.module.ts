import { NgModule } from '@angular/core';
import { MaterialDesignModule } from 'app/shared/material-design.module';

import { PageLayoutsRoutingModule } from './page-layouts-routing.module';
import { PageLayoutsComponent } from './page-layouts.component';

import { PageLayoutCenteredComponent } from './centered/centered.component';
import { PageLayoutFullWidthComponent } from './full-width/full-width.component';
import { PageLayoutWidthTabsComponent } from './with-tabs/with-tabs.component';

@NgModule({
  imports: [
    MaterialDesignModule,
    PageLayoutsRoutingModule,
  ],
  declarations: [
    PageLayoutsComponent,
    PageLayoutCenteredComponent,
    PageLayoutFullWidthComponent,
    PageLayoutWidthTabsComponent,
  ]
})

export class PageLayoutsModule {}
