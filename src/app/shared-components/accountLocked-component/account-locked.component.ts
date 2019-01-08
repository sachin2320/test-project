import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AppConfig } from "app/configuration/app.config";

@Component({
    selector: 'account-locked',
    templateUrl: './account-locked.component.html',
})

export class AccountLockedComponent {
    @Input('message') message: string = "";
    @Input('componentid') componentId: string = "";
    @Output('onLoginBtnClicked') navigateToLogin = new EventEmitter();

    constructor(public config: AppConfig) {
        this.componentId = this.getRandomInt(1, 100000);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    redirectToLogin() {
        this.navigateToLogin.emit();
    }
}