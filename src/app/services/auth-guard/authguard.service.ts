import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { AuthenticationService } from "app/services/auth-service/authentication.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.authenticate()
      .map(authenticated => {
        if (!authenticated) {
          if (this.includeInRedirectUrl(state.url)) {
            this.authService.redirectUrl = state.url;
          } else {
            this.authService.redirectUrl = '';
          }
          this.authService.logOut();
        } else if (this.includeInRedirectUrl(state.url)) {
          this.authService.redirectUrl = state.url;
        }
        return authenticated;
      });
  }

  private includeInRedirectUrl(stateUrl: string) : boolean {
    return (
      stateUrl.includes('/app/home/dashboard') ||
      stateUrl.includes('/app/home/dashboard?Type=MP') ||
      stateUrl.includes('/app/policy/my-document') ||
      stateUrl.includes('/app/service/list') ||
      stateUrl.includes('/app/account/action') ||
      stateUrl.includes('/app/contact')
    );
  }

  // private excludeFromRedirectUrl(stateUrl: string) : boolean {
  //   return (
  //     stateUrl.includes('/app/account/action') ||
  //     stateUrl.includes('/user/password/forgot') ||
  //     stateUrl.includes('/user/username/forgot') ||
  //     stateUrl.includes('/user/registration'));
  // }
}