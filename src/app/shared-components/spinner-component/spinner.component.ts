import { Component, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { SpinnerService } from "app/shared-services/spinner.service";

@Component({
    selector: 'fgl-spinner',
    templateUrl: './spinner.component.html'
})

export class SpinnerComponent {
    public showLoader: boolean;

    public constructor(spinner: SpinnerService) {
        spinner.status.subscribe((status: boolean) => {
            this.showLoader = status;
        });
    }
}