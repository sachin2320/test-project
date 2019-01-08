import { AppConfig } from 'app/configuration/app.config';
import { AccountService } from 'app/services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { RegistrationModel } from 'app/models/Registration.model';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { NavigationExtras, Router } from '@angular/router';

/* This component is used to display "My Profile" page */
@Component({
  selector: 'account-action',
  templateUrl: './account-action.component.html'
})

export class AccountActionComponent implements OnInit {
  public accountDetail: RegistrationModel;

  constructor(public config: AppConfig,
    private myAccountService: AccountService,
    private notification: SnackbarService,
    private router: Router
  ) { }

  ngOnInit() {

    this.myAccountService.getAccountDetail().subscribe(res => {
      this.accountDetail = res;     
    },
      error => {
        this.notification.popupSnackbar(error);
      });
  }

  changePhoneNumber() {    
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "phoneNumber": this.accountDetail.phone       
      },      
      skipLocationChange:true
    };
    this.router.navigate([this.config.getConfig('appChangePhoneUrl')], navigationExtras);
  }

  changeEmail() {    
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "email": this.accountDetail.email       
      },      
      skipLocationChange:true
    };
    this.router.navigate([this.config.getConfig('appChangeEmailUrl')], navigationExtras);
  }
}
