import { Routes, RouterModule } from '@angular/router';
import { ServiceComponent } from 'app/service-request/service.component';
import { AuthGuardService } from 'app/services/auth-guard/authguard.service';
import { ServiceRequestListComponent } from 'app/service-request/service-request-list/service-request-list.component';
import { ServiceRequestOnlineComponent } from 'app/service-request/service-request-create/online/online.component';
import { DemoSanjeevComponent } from 'app/service-request/DemoForSanjeev/demo-sanjeev.component';
import { DuplicateServiceRequestOnlineComponent } from 'app/service-request/service-request-duplicate/online/online.component';
import { ServiceRequestPrintComponent } from 'app/service-request/service-request-print/online/online.component';
import { ServiceRequestViewComponent } from 'app/service-request/service-request-view/online/online.component';
import { ServiceRequestSelectionComponent } from 'app/service-request/service-request-selection/service-request-selection.component';
import { ServiceRequestOfflineComponent } from 'app/service-request/service-request-create/offline/offline.component';
import { ChangeNameOnlineComponent } from 'app/service-request/change-name/online/online.component';

export const ServiceRoutes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'list', component: ServiceRequestListComponent, canActivate: [AuthGuardService] },
      { path: 'request/online/:PolicyNumber/:ServiceRequestType', component: ServiceRequestOnlineComponent, canActivate: [AuthGuardService] },
      { path: 'request/download/:PolicyNumber/:ServiceRequestType', component: ServiceRequestOfflineComponent, canActivate: [AuthGuardService] },
      { path: 'request/download/:PolicyNumber/:ServiceRequestType', component: ServiceRequestOfflineComponent, canActivate: [AuthGuardService] },
      { path: 'name/change/online', component: ChangeNameOnlineComponent },
      { path: 'demo/for/sanjeev', component: DemoSanjeevComponent },
      { path: 'duplicate/service/request', component: DuplicateServiceRequestOnlineComponent },
      { path: 'request/print/:zendeskRequestId', component: ServiceRequestPrintComponent , canActivate: [AuthGuardService] },
      { path: 'request/view/:zendeskRequestId', component: ServiceRequestViewComponent, canActivate: [AuthGuardService] },      
      { path: 'request', component: ServiceRequestSelectionComponent , canActivate: [AuthGuardService] },
      { path: 'request/:PolicyNumber/:ServiceRequestType', component: ServiceRequestSelectionComponent , canActivate: [AuthGuardService] }

    ]
  }
];

export const ServiceRoutingModule = RouterModule.forChild(ServiceRoutes);