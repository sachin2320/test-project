import { RouterModule, Routes } from '@angular/router';
import { ChangePhoneComponent } from 'app/account/change-phone/change-phone.component';
import { ChangeBeneficiaryInstructionsComponent } from 'app/instructions/service-request/instructions.component';
import { LoginSsoComponent } from 'app/login-sso/loginsso.component';
import { LogoutComponent } from 'app/logout/logout.component';
import { RegsitrationLandingComponent } from 'app/registration/registrationLanding/regsitrationLanding.component';
import { RegistrationComponent } from "app/registration/regsitration.component";
import { PrivacyPolicyComponent } from 'app/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from 'app/registration/termsAndConditions/termsAndConditions.component';
import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { ChangeEmailComponent } from "app/user/change-email/change-email.component";
import { ChangePasswordComponent } from "app/user/change-password/change-password.component";
import { ChangeSecurityQuestionsComponent } from "app/user/change-securityquestions/change-securityquestions.component";
import { EmailUpdationComponent } from "app/user/email-updation/email-updation.component";
import { EmailVerificationComponent } from "app/user/email-verification/email-verification.component";
import { ForgotPasswordComponent } from "app/user/forgot-password/forgot-password.component";
import { ForgotUsernameComponent } from "app/user/forgot-username/forgot-username.component";
import { ResetPasswordComponent } from "app/user/reset-password/reset-password.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

const AppRoutes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: 'login/sso', component: LoginSsoComponent }, 
  { path: 'logout', component: LogoutComponent }, 
  { path: 'app/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'app/registration/term-conditions', component: TermsAndConditionsComponent },
  { path: 'user/registration/landing', component: RegsitrationLandingComponent },
  { path: 'user/registration', component: RegistrationComponent },
  { path: 'app', component: LayoutComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'user/username/forgot', component: ForgotUsernameComponent },
  { path: 'user/password/forgot', component: ForgotPasswordComponent },
  { path: 'user/password/change', component: ChangePasswordComponent },
  { path: 'user/email/change', component: ChangeEmailComponent },
  { path: 'user/passowrd/reset/:username/:temppassword', component: ResetPasswordComponent },
  { path: 'user/email/verification/:username/:email', component: EmailVerificationComponent },
  { path: 'user/email/update', component: EmailUpdationComponent },
  { path: 'user/securityqestions/change', component: ChangeSecurityQuestionsComponent, canActivate: [AuthGuardService] },
  { path: 'user/phone/update', component: ChangePhoneComponent, canActivate: [AuthGuardService] }, 
  { path: 'service/request/instructions/:serviceRequestType', component: ChangeBeneficiaryInstructionsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

export const AppRoutingModule = RouterModule.forRoot(AppRoutes, { useHash: true });
