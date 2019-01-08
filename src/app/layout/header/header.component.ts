import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from "app/configuration/app.config";
import { HeaderService } from "app/layout/header/header.service";
import { AccountService } from 'app/services/account/account.service';
import { StorageService } from "app/services/storage/local-storage";
import { APPCONFIG } from '../../config';

declare var jQuery: any;
@Component({
  selector: 'my-app-header',
  styles: [],
  templateUrl: './header.component.html'
})

export class AppHeaderComponent implements OnInit {
  public AppConfig: any;

  public userName: string = "";
  public isLogoutDisabled: boolean = false;

  public constructor(private account: AccountService,
    private headerService: HeaderService,
    public config: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService) {
  }

  ngOnInit() {
    this.userName = this.storage.readKey(this.config.getConfig("account_name_key"));
    this.AppConfig = APPCONFIG;
    let __this: any = this;
    $(window).on('mouseenter', function () {
      let accountName = __this.storage.readKey(__this.config.getConfig("account_name_key"));
      if (__this.userName != "" && accountName != "") {
        if (__this.userName != accountName) {
          __this.userName = accountName;
          __this.router.navigate([__this.config.getConfig('appHomeUrl')]);
          location.reload();
        }
      }
    });
  }

  signOut() {
    this.userName = "";
    this.isLogoutDisabled = true;
    this.account.logoutAccount();
  }
}
