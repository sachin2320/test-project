import { APPCONFIG } from '../../config';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from "app/configuration/app.config";

@Component({
  selector: 'my-app-sidenav',
  styles: [],
  templateUrl: './sidenav.component.html'
})

export class AppSidenavComponent implements OnInit {
  AppConfig;

  constructor(public config: AppConfig, private router: Router) {
  }

  ngOnInit() {
    this.AppConfig = APPCONFIG;
  }

  toggleCollapsedNav() {
    this.AppConfig.navCollapsed = !this.AppConfig.navCollapsed;
  }

  goHome() {
    // console.log("Go home... TBD");
    this.router.navigate([this.config.getConfig('appHomeUrl')]);
  }
}
