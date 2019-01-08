import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { Routes, RouterModule } from '@angular/router';
import { StatementComponent } from "app/statement/statement.component";
import { StatementDetailComponent } from "app/statement/statement-detail/statement-detail.component";


export const StatementRoutes: Routes = [
  {
    path: '',
    component: StatementComponent,
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'detail', component: StatementDetailComponent, canActivate: [AuthGuardService] }
    ]
  }
];

export const StatementRoutingModule = RouterModule.forChild(StatementRoutes);
