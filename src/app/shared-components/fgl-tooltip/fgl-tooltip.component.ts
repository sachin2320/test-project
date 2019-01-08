import { Component, Input, OnDestroy } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PolicyModel } from '../../models/policy.model';

@Component({
    selector: 'fgl-tooltip',
    templateUrl: './fgl-tooltip.component.html'
})

export class FglTooltipComponent { 
    @Input('title') title: string;
    @Input('class') class: string;
    @Input('product') product: string;
    @Input('policy') policy: PolicyModel;
}

