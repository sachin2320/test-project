import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { ContactComponent } from 'app/contact-us/contact.component';
import { ContactUsComponent } from 'app/contact-us/contact/contact-us.component';
import { Routes, RouterModule } from '@angular/router';

export const ContactRoutes: Routes = [
  {
    path: '',
    component: ContactComponent,
    children: [     
      { path: '', component: ContactUsComponent,canActivate: [AuthGuardService]},
      { path: ':id', component: ContactUsComponent, canActivate: [AuthGuardService]}
    ]
  }
];

export const ContactRoutingModule = RouterModule.forChild(ContactRoutes);
