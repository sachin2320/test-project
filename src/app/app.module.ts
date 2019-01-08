import { NgModule, ApplicationRef, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Layout
import { LayoutComponent } from './layout/layout.component';
import { PreloaderDirective } from './layout/preloader.directive';
// Header
import { AppHeaderComponent } from './layout/header/header.component';
// Sidenav
import { AppSidenavComponent } from './layout/sidenav/sidenav.component';
import { ToggleOffcanvasNavDirective } from './layout/sidenav/toggle-offcanvas-nav.directive';
import { AutoCloseMobileNavDirective } from './layout/sidenav/auto-close-mobile-nav.directive';
import { AppSidenavMenuComponent } from './layout/sidenav/sidenav-menu/sidenav-menu.component';
import { AccordionNavDirective } from './layout/sidenav/sidenav-menu/accordion-nav.directive';
import { AppendSubmenuIconDirective } from './layout/sidenav/sidenav-menu/append-submenu-icon.directive';
import { HighlightActiveItemsDirective } from './layout/sidenav/sidenav-menu/highlight-active-items.directive';
// Customizer
import { AppCustomizerComponent } from './layout/customizer/customizer.component';
import { ToggleQuickviewDirective } from './layout/customizer/toggle-quickview.directive';
// Footer
import { AppFooterComponent } from './layout/footer/footer.component';
// Search Overaly
import { AppSearchOverlayComponent } from './layout/search-overlay/search-overlay.component';
import { SearchOverlayDirective } from './layout/search-overlay/search-overlay.directive';
import { OpenSearchOverlaylDirective } from './layout/search-overlay/open-search-overlay.directive';

// Pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageLayoutFullscreenComponent } from './page-layouts/fullscreen/fullscreen.component';

import { LoginComponent } from './login/login.component';
// Sub modules
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';

// hmr
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { HeaderService } from "app/layout/header/header.service";

//Configuration
import { AppConfig } from "app/configuration/app.config";
import { CommonService } from "app/shared-services/common.service";
import { ErrorService } from "app/shared-services/error.service";
import { SpinnerComponent } from "app/shared-components/spinner-component/spinner.component";
import { RegistrationComponent } from "app/registration/regsitration.component";
import { SpinnerService } from "app/shared-services/spinner.service";
import { ToolTipComponent } from "app/shared-components/toolTip-component/toolTip.component";
import { RegistrationService } from "app/services/registration/registration.service";
import { PolicyService } from "app/services/policy/policy.service";
import { ServiceRequestService } from "app/services/service-request/service-request.service";
import { HttpService } from "app/services/http/http.service";
import { StorageService } from "app/services/storage/local-storage";
import { AuthGuardService } from "app/services/auth-guard/authguard.service";
import { AccountService } from "app/services/account/account.service";
import { PersonalInfoComponent } from "app/registration/personalInfo/personalInfo.component";
import { CredentialInfoComponent } from "app/registration/credentialInfo/credentialInfo.component";
import { SecurityInfoComponent } from "app/registration/securityInfo/securityInfo.component";
import { QuestionAnswerComponent } from "app/shared-components/questionAnswer-component/questionAnswer.component";
import { SpinnerSmallComponent } from "app/shared-components/spinnerSmall-component/spinnerSmall.component";
import { TokenService } from "app/services/token/token.service";
import { SnackbarService } from "app/shared-services/snackbar.service";
import { EmailVerificationService } from "app/services/registration/email-verification.service";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { PasswordComponent } from "app/shared-components/password-component/password.component";
import { AccountLockedComponent } from "app/shared-components/accountLocked-component/account-locked.component";
import { ForgotUsernameComponent } from "app/user/forgot-username/forgot-username.component";
import { ForgotPasswordComponent } from "app/user/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "app/user/reset-password/reset-password.component";
import { EmailVerificationComponent } from "app/user/email-verification/email-verification.component";
import { EmailUpdationComponent } from "app/user/email-updation/email-updation.component";
import { AuthenticationService } from "app/services/auth-service/authentication.service";
import { ChangePasswordComponent } from "app/user/change-password/change-password.component";
import { ChangeEmailComponent } from "app/user/change-email/change-email.component";
import { EmailComponent } from "app/shared-components/email-component/email.component";
import { UtilityService } from "app/services/helper/utility.service";
import { FglDialogComponent } from 'app/shared-components/dialog.component/dialog.component';
import { RegsitrationLandingComponent } from 'app/registration/registrationLanding/regsitrationLanding.component';
import { RegsitrationWelcomeComponent } from 'app/registration/registrationWelcome/registrationWelcome.component';
import { ChangePhoneComponent } from 'app/account/change-phone/change-phone.component';
import { LogoutComponent } from 'app/logout/logout.component';
import { DataService } from 'app/shared-services/data.service';
import { PrivacyPolicyComponent } from 'app/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from 'app/registration/termsAndConditions/termsAndConditions.component';
import { ChangeBeneficiaryInstructionsComponent } from 'app/instructions/service-request/instructions.component';
import { RecaptchaModule } from 'ng-recaptcha';

// Bootstrap controls (tooltip)
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginSsoComponent } from 'app/login-sso/loginsso.component';
import { ChangeSecurityQuestionsComponent } from "app/user/change-securityquestions/change-securityquestions.component";

export function initConfig(config: AppConfig) {
  return () => config.load()
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    RecaptchaModule.forRoot(),

    // Sub modules
    LayoutModule,
    SharedModule,
  ],
  declarations: [
    SpinnerComponent,
    SpinnerSmallComponent,
    ToolTipComponent,
    AppComponent,
    FglDialogComponent,
    // Layout
    LayoutComponent,
    PreloaderDirective,
    // Header
    AppHeaderComponent,
    // Sidenav
    AppSidenavComponent,
    ToggleOffcanvasNavDirective,
    AutoCloseMobileNavDirective,
    AppSidenavMenuComponent,
    AccordionNavDirective,
    AppendSubmenuIconDirective,
    HighlightActiveItemsDirective,

    // Customizer
    AppCustomizerComponent,
    ToggleQuickviewDirective,

    // Footer
    AppFooterComponent,

    // Search overlay
    AppSearchOverlayComponent,
    SearchOverlayDirective,
    OpenSearchOverlaylDirective,

    //Dashboard
    DashboardComponent,

    //Login &  Registration
    LoginComponent,
    LoginSsoComponent,
    LogoutComponent,
    ForgotUsernameComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RegsitrationLandingComponent,
    RegistrationComponent,
    RegsitrationWelcomeComponent,
    PersonalInfoComponent,
    CredentialInfoComponent,
    SecurityInfoComponent,
    QuestionAnswerComponent,
    EmailVerificationComponent,
    EmailUpdationComponent,
    PasswordComponent,
    ChangePasswordComponent,
    ChangePhoneComponent,
    EmailComponent,
    ChangeEmailComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    ChangeSecurityQuestionsComponent,

    //Instructions
    ChangeBeneficiaryInstructionsComponent,

    // Pages
    PageLayoutFullscreenComponent,

    //Message
    AccountLockedComponent
  ],
  providers: [
    SnackbarService,
    HeaderService,
    HttpService,
    TokenService,
    StorageService,
    CommonService,
    DataService,
    AuthenticationService,
    RegistrationService,
    EmailVerificationService,
    ForgotPasswordService,
    PolicyService,
    ServiceRequestService,
    AccountService,
    ErrorService,
    SpinnerService,
    AuthGuardService,
    UtilityService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ToolTipComponent,
    FglDialogComponent
  ]
})

export class AppModule {
  constructor(public appRef: ApplicationRef) {

  }
  hmrOnInit(store) {
    // console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
