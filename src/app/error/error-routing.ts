import { Routes, RouterModule } from '@angular/router';
import { FglErrorComponent } from 'app/error/error-component/error-component';
import { ErrorComponent } from 'app/error/error.component';


export const ErrorRoutes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [      
      { path: ':errorCode/:home', component: FglErrorComponent },
    ]
  }
];

export const ErrorRoutingModule = RouterModule.forChild(ErrorRoutes);
