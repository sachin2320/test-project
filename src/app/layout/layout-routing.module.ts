import { DashboardComponent } from '../dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'policy', loadChildren: '../policy/policy.module#PolicyModule' },
      { path: 'home', loadChildren: '../home/home.module#HomeModule' },
      { path: 'service', loadChildren: '../service-request/service.module#ServiceModule' },
      { path: 'account', loadChildren: '../account/account.module#AccountModule' },
      { path: 'statement', loadChildren: '../statement/statement.module#StatementModule' },
      { path: 'contact', loadChildren: '../contact-us/contact.module#ContactModule' },
      { path: 'error', loadChildren: '../error/error.module#ErrorModule' }
    ]
  }
];

export const LayoutRoutingModule = RouterModule.forChild(routes);
