import { AppConfig } from "app/configuration/app.config";
import { AuthenticationService } from "app/services/auth-service/authentication.service";
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from "app/shared-services/snackbar.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from 'app/shared-services/validation.service';

@Component({
  selector: 'my-page-login',
  styles: [],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  loginForm: any = {};

  errorMessage: string;

  public isAccountLocked: boolean = false;
  public accountLockedMsg: string = "";

  constructor(private spinner: SpinnerService,
    private auth: AuthenticationService,
    private formBuilder: FormBuilder,
    private notification: SnackbarService,
    private router: Router,
    public config: AppConfig) {
    this.auth.clearToken();
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.minLength(8), Validators.maxLength(50)]],
      password: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.minLength(8), Validators.maxLength(100)]]
    });
  }

  login(form: any) {
    this.errorMessage = "";
    this.notification.popupSnackbar("");

    if (!this.loginForm.dirty || !this.loginForm.valid)
      return;

    this.spinner.start();
    this.auth.issueAccessToken(form.value.userName, form.value.password).subscribe(res => {
      if (res.Success) {
        this.spinner.stop();
        if (this.auth.redirectUrl) {
          let url = this.auth.redirectUrl;
          this.auth.redirectUrl = '';
          if (url.includes('Type')) {
            url = '/app/home/dashboard';
            this.router.navigate([url], { queryParams: { Type: 'MP' }});
          } else {
            this.router.navigate([url]);
          }
        }
        else
          this.router.navigate([this.config.getConfig('appHomeUrl')]);
      }
      else {
        this.spinner.stop();
        if (res.code == "1073") { //Temp Password is generated and need to change
          this.router.navigate([this.config.getConfig('appResetPasswordUrl'), form.value.userName, form.value.password], { skipLocationChange: true });
        }
        else if (res.code == "1006") { //User is not confirmed
          this.router.navigate([this.config.getConfig('appEmailVerificationUrl'), form.value.userName, res.Email], { skipLocationChange: true });
        }
        else {
          if (!this.isUserLocked(res))
            this.handleException(res.Message);
        }
      }
    },
      error => {
        this.handleException(error);
      });
  }

  isUserLocked(res: any): boolean {
    //TODO :  Once message get finalized for throug out then app then need to remove below check condition
    if (res.code == "1081" || res.code == "1082" || res.code == "1083" || res.code == "1084" || res.code == "1085") { //User is permanent/temp Locked
      this.isAccountLocked = true;
      this.accountLockedMsg = res.Message;
      return true;
    }
    return false;
  }

  handleException(message: string) {
    this.spinner.stop();
    this.errorMessage = message;
    this.notification.popupSnackbar(message);
  }

  navigateToLogin()
  {   
    this.isAccountLocked = false;
  }

}
