import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'app/services/token/token.service';
import { AppConfig } from "app/configuration/app.config";
import { JwtHelper } from "app/common/helper/jwt-helper";

@Component({
  selector: 'single-sign',
  styles: [],
  templateUrl: './loginsso.component.html'
})

export class LoginSsoComponent {
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public config: AppConfig, private tokenService: TokenService, private route: ActivatedRoute, private router: Router) {
    var queryParam = this.route.snapshot.params;
    if (queryParam != null && queryParam != undefined) {
      let jwtToken = this.route.snapshot.queryParams.jwt || '';
      let refreshToken = this.route.snapshot.queryParams.refresh || '';
      this.storeToken(jwtToken, refreshToken);
    }
  }

  storeToken(jwt: string, refreshToken: string) {
    let token = { access_token: jwt, refresh_token: refreshToken, name: this.jwtHelper.getFullName(jwt) };
    this.tokenService.saveToken(token);

    this.router.navigate([this.config.getConfig('appHomeUrl')]);
  }
}
