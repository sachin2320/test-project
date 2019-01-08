import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { DashboardComponent } from "app/home/dashboard/dashboard.component";
import { HomeComponent } from "app/home/home.component";
import { Routes, RouterModule } from '@angular/router';

export const HomeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuardService]}
    ]
  }
];

export const HomeRoutingModule = RouterModule.forChild(HomeRoutes);
