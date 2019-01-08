import { Component, Input, OnDestroy } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PolicyModel } from '../../models/policy.model';

@Component({
    selector: 'fgl-tooltip-dynamic',
    templateUrl: './fgl-tooltip-dynamic.component.html'
})

export class FglTooltipDynamicComponent { 
    @Input('tooltipText') tooltipText: string;
    @Input('class') class: string;
}

