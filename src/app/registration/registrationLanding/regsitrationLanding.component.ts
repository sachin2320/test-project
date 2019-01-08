
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";

@Component({
    selector: 'regsitration-landing',
    styles: [],
    templateUrl: './registrationLanding.component.html'
})

export class RegsitrationLandingComponent {
    constructor(
        private router: Router,
        public config: AppConfig) {
    }
    
    navigatePrevious(event){
        this.router.navigate([this.config.getConfig('appLoginUrl')]);
    }

    navigateToRegister(event){
        this.router.navigate([this.config.getConfig('appRegisterUrl')]);
    }
}