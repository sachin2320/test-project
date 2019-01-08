import { AppConfig } from "app/configuration/app.config";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'my-page-logout',
  styles: [],
  templateUrl: './logout.component.html'
})

export class LogoutComponent {
  constructor(
    private router: Router,
    public config: AppConfig) {
  }

  navigateToLogin(event) {
    this.router.navigate([this.config.getConfig('appLoginUrl')]);
  }
}