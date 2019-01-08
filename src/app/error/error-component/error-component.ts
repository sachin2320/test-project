import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { ErrorType } from 'app/enums/error-type.enum';


@Component({
    selector: 'fgl-error-component',
    styles: [],
    templateUrl: './error-component.html'
})

export class FglErrorComponent implements OnInit {
    public errorCode: number = ErrorType.None;
    public errorMessage: string = '';
    public showHomeButton: boolean = false;

    constructor(private route: ActivatedRoute,public config: AppConfig) {
        this.errorCode =Number(this.route.snapshot.paramMap.get('errorCode'));
        this.showHomeButton =Boolean(this.route.snapshot.paramMap.get('home'));
    }
    ngOnInit() {
        if (this.errorCode == ErrorType.PageNotFoundCode) {
            this.errorMessage =this.config.getConfig('pageNotFound');
        }
        else if (this.errorCode == ErrorType.InternalServerError) {
            this.errorMessage =this.config.getConfig('internalServerError');
        }
        else if (this.errorCode == ErrorType.PolicyCanNotView) {
            this.errorMessage =this.config.getConfig('policyDetailCanNotView');
        }
        else if (this.errorCode == ErrorType.PolicyNotFound) {
            this.errorMessage =this.config.getConfig('policyNotFound');
        }
        else if (this.errorCode == ErrorType.ServiceRequestNotFound) {
            this.errorMessage =this.config.getConfig('serviceRequestNotFound');
        }
        else if (this.errorCode == ErrorType.ServiceRequestDetailNotFetch) {
            this.errorMessage =this.config.getConfig('serviceRequestDetailsNotFetched');
        }
        else if (this.errorCode == ErrorType.InvalidServiceRequestForPolicy) {
            this.errorMessage =this.config.getConfig('invalidServiceRequestForPolicy');
        }
    }
}
